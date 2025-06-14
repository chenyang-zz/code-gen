import { Textarea } from "@/components/ui/textarea";
import useChatStore from "@/stores/chat";
import useSettingStore from "@/stores/setting";
import React, { useRef, useState } from "react";
import ModelSelect from "./ModelSelect";
import PromptSelect from "./PromptSelect";
import ChatLanguage from "./ChatLanguage";
import ChatLink from "./ChatLink";
import { useLocalStorage } from "@reactuses/core";
import RagSwitch from "./RagSwitch";
import ChatPlaceholder from "./ChatPlaceholder";
import ClipboardMonitor from "./ClipboardMonitor";
import ClearContext from "./ClearContext";
import ClearChat from "./ClearChat";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { TooltipButton } from "@/components/TooltipButton";
import { Send, Square } from "lucide-react";
import MarkGen from "./MarkGen";
import useTagStore from "@/stores/tag";
import useMarkStore from "@/stores/mark";
import useVectorStore from "@/stores/vector";
import { fetchAiPlaceholder, fetchAiStream } from "@/lib/ai";

const ChatInput = () => {
	const t = useTranslations("record.chat.input");
	const [text, setText] = useState("");
	const [placeholder, setPlaceholder] = useState("");
	const [isComposing, setIsComposing] = useState(false);
	const { apiKey } = useSettingStore();
	const {
		loading,
		setLoading,
		createChat,
		isLinkMark,
		chats,
		isPlaceholderEnabled,
		saveChat,
	} = useChatStore();
	const { currentTagId } = useTagStore();
	const { fetchMarks, marks, trashState } = useMarkStore();
	const { isRagEnabled } = useVectorStore();
	const [inputType, setInputType] = useLocalStorage(
		"chat-input-type",
		"chat"
	);
	const markGenRef = useRef<{ openGen: () => void }>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
		const textarea = e.target;
		textarea.style.height = "auto";
		const newHeight = Math.min(textarea.scrollHeight, 240);
		textarea.style.height = `${newHeight}px`;
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Entry" && !isComposing && !e.shiftKey) {
			e.preventDefault();
		}
	};

	// 切换输入类型
	const handleInputTypeChange = (value: string) => {
		setInputType(value);
	};

	// 终止对话功能
	const terminateChat = () => {};

	// 对话
	const handleSubmit = async () => {
		if (text === "") return;
		setText("");

		// 重置 textarea 的高度为默认值
		const textarea = document.querySelector("textarea");
		if (textarea) {
			textarea.style.height = "auto";
		}
		setLoading(true);
		await createChat({
			tagId: currentTagId,
			role: "user",
			type: "chat",
			inserted: false,
			content: text,
			image: undefined,
		});

		const message = await createChat({
			tagId: currentTagId,
			role: "system",
			type: "chat",
			inserted: false,
			content: "",
			image: undefined,
		});
		if (!message) return;

		await fetchMarks();
		const scanMarks = isLinkMark
			? marks.filter((item) => item.type === "scan")
			: [];
		const textMarks = isLinkMark
			? marks.filter((item) => item.type === "text")
			: [];
		const imageMarks = isLinkMark
			? marks.filter((item) => item.type === "image")
			: [];
		const linkMarks = isLinkMark
			? marks.filter((item) => item.type === "link")
			: [];
		const fileMarks = isLinkMark
			? marks.filter((item) => item.type === "file")
			: [];
		const lastClearIndex = chats.findLastIndex(
			(item) => item.type === "clear"
		);
		const chatsAfterClear = chats.splice(lastClearIndex + 1);

		// 准备请求内容
		let ragContext = "";
		// 如果启用RAG，获取相关上下文
		if (isRagEnabled) {
			try {
				// 导入getContextForQuery函数
				const { getContextForQuery } = await import("@/lib/rag");
				// 获取相关文档内容
				ragContext = await getContextForQuery(text);

				if (ragContext) {
					// 如果获取到了相关内容，将其作为独立部分添加到请求中
					ragContext = `
以下是你的知识库中与该问题最相关的内容，请充分利用这些信息来回答问题：

${ragContext}

`;
				}
			} catch (error) {
				console.error("获取RAG上下文失败:", error);
			}
		}

		const request_content = `
			可以参考以下内容笔记的记录：
			以下是通过截图后，使用OCR识别出的文字片段：
			${scanMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是通过文本复制记录的片段：
			${textMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是插图记录的片段描述：
			${imageMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是链接记录的片段描述：
			${linkMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是文件记录的片段描述：
			${fileMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下聊天记录：
			${chatsAfterClear
				.filter(
					(item) =>
						item.tagId === currentTagId && item.type === "chat"
				)
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			${ragContext}
			${text}
    	`;

		// 先保存空消息，然后通过流式请求更新
		await saveChat(
			{
				...message,
				content: "",
			},
			true
		);

		// 创建新的 AbortController 用于终止请求
		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;

		// 使用流式方式获取AI结果
		let cache_content = "";
		try {
			await fetchAiStream(
				request_content,
				async (content) => {
					cache_content += content;
					// 每次收到流式内容时更新消息
					await saveChat(
						{
							...message,
							content: cache_content,
						},
						false
					);
				},
				signal
			);
		} catch (error: any) {
			// 如果不是中止错误，则记录错误信息
			if (error.name !== "AbortError") {
				console.error("Stream error:", error);
			}
		} finally {
			abortControllerRef.current = null;
			setLoading(false);
			await saveChat(
				{
					...message,
					content: cache_content,
				},
				true
			);
		}
	};

	// 获取输入框占位符
	const genInputPlaceholder = async () => {
		setPlaceholder("...");
		if (!apiKey) return;
		if (trashState) return;
		// 检查是否启用了AI占位符功能
		if (!isPlaceholderEnabled) {
			setPlaceholder(t("placeholder.default"));
			return;
		}

		const scanMarks = isLinkMark
			? marks.filter((item) => item.type === "scan")
			: [];
		const textMarks = isLinkMark
			? marks.filter((item) => item.type === "text")
			: [];
		const imageMarks = isLinkMark
			? marks.filter((item) => item.type === "image")
			: [];
		const fileMarks = isLinkMark
			? marks.filter((item) => item.type === "file")
			: [];
		const linkMarks = isLinkMark
			? marks.filter((item) => item.type === "link")
			: [];
		const lastClearIndex = chats.findLastIndex(
			(item) => item.type === "clear"
		);
		const chatsAfterClear = chats.slice(lastClearIndex + 1);
		const request_content = `
			请你扮演一个笔记软件的智能助手的 placeholder，可以参考以下内容笔记的记录，
			以下是通过截图后，使用OCR识别出的文字片段：
			${scanMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是通过文本复制记录的片段：
			${textMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是插图记录的片段描述：
			${imageMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是文件记录的片段描述：
			${fileMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是链接记录的片段描述：
			${linkMarks
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下聊天记录：
			${chatsAfterClear
				.filter(
					(item) =>
						item.tagId === currentTagId && item.type === "chat"
				)
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			以下是用户之前的提问记录：
			${chatsAfterClear
				.filter(
					(item) =>
						item.tagId === currentTagId &&
						item.type === "chat" &&
						item.role === "user"
				)
				.map((item, index) => `${index + 1}. ${item.content}`)
				.join(";\n\n")}。
			分析这些记录的内容，编写一个可能会向你提问的问题，用于辅助用户向你提问，不要返回用户已经提过的类似问题，不许超过 20 个字。
    	`;

		// 使用非流式请求获取placeholder内容
		const content = await fetchAiPlaceholder(request_content);
		if (content.length < 30 && content.length > 10) {
			setPlaceholder(content + "[Tab]");
		}
	};

	return (
		<footer className="relative flex flex-col border rounded-xl p-2 gap-2 mb-2 w-[calc(100%-1rem)]">
			<div className="flex w-full relative items-start">
				<Textarea
					className="flex-1 p-2 relative border-none focus-visible:ring-0 shadow-none min-h-[36px] max-h-[240px] resize-none"
					value={text}
					onChange={handleTextChange}
					placeholder={placeholder}
					disabled={!apiKey || loading}
					onKeyDown={handleKeydown}
					onCompositionStart={() => setIsComposing(true)}
					onCompositionEnd={() =>
						setTimeout(() => setIsComposing(false), 0)
					}
				/>
			</div>
			<div className="flex justify-between items-center w-full">
				<div className="flex">
					<ModelSelect />
					<PromptSelect />
					<ChatLanguage />
					<ChatLink inputType={inputType} />
					<RagSwitch />
					<ChatPlaceholder />
					<ClipboardMonitor />
					<ClearContext />
					<ClearChat />
				</div>

				<div className="flex items-center justify-end gap-2 pr-1">
					<Tabs
						value={inputType!}
						onValueChange={handleInputTypeChange}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="gen">
								{t("organize")}
							</TabsTrigger>
							<TabsTrigger value="chat">{t("chat")}</TabsTrigger>
						</TabsList>
					</Tabs>
					{inputType === "gen" ? (
						<MarkGen inputValue={text} ref={markGenRef} />
					) : loading ? (
						<TooltipButton
							variant={"ghost"}
							size="sm"
							icon={<Square className="text-destructive" />}
							tooltipText={t("terminate")}
							onClick={terminateChat}
						/>
					) : (
						<TooltipButton
							variant={"default"}
							size="sm"
							icon={<Send className="size-4" />}
							disabled={!apiKey}
							tooltipText={t("send")}
							onClick={handleSubmit}
						/>
					)}
				</div>
			</div>
		</footer>
	);
};

export default ChatInput;
