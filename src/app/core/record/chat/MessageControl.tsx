import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { Chat } from "@/db/chats";
import useChatStore from "@/stores/chat";
import dayjs from "dayjs";
import { Clock, GlobeIcon, TypeIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import wordsCount from "words-count";
import { languageOptions } from "./ChatLanguage";
import { clear, hasText, readText } from "tauri-plugin-clipboard-api";
import { scrollToBottom } from "@/lib/workspace";
import { fetchAiTranslate } from "@/lib/ai";

interface MessageControlProps {
	chat: Chat;
	children: React.ReactNode;
}

const MessageControl = ({ chat, children }: MessageControlProps) => {
	const t = useTranslations("record.chat.messageControl");
	const translateT = useTranslations("record.chat.input.translate");
	const [translatedContent, setTranslatedContent] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("");
	const [isTranslating, setIsTranslating] = useState(false);
	const { loading } = useChatStore();
	const count = wordsCount(chat.content || "");

	// 重置翻译
	const resetTranslation = () => {
		setTranslatedContent("");
		setSelectedLanguage("");
	};

	// 处理翻译
	const handleTranslate = async (language: string) => {
		if (!chat.content || isTranslating) return;

		setIsTranslating(true);
		setSelectedLanguage(language);

		try {
			const translatedText = await fetchAiTranslate(
				chat.content,
				language
			);
			setTranslatedContent(translatedText);
		} catch (error) {
			console.error("Translation error:", error);
		} finally {
			setIsTranslating(false);
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	};

	const handleDelete = async () => {
		if (chat.type === "clipboard" && !chat.image) {
			const hasTextRes = await hasText();
			if (hasTextRes) {
				try {
					const text = await readText();
					if (text === chat.content) {
						await clear();
					}
				} catch (error) {
					console.error("Failed to clear clipboard", error);
				}
			}
		}
	};

	if (!loading) {
		return (
			<>
				<div className="flex items-center gap-1 -translate-x-3">
					<Button variant="ghost" size="sm" disabled>
						<Clock className="size-4" />
						{dayjs(chat.createdAt).fromNow()}
					</Button>
					<Separator orientation="vertical" className="!h-4" />
					{count && (
						<>
							<Button variant="ghost" size="sm" disabled>
								<TypeIcon className="size-4" />
								{count} {t("words")}
							</Button>
							<Separator
								orientation="vertical"
								className="!h-4"
							/>
						</>
					)}

					{/* 翻译功能 */}
					{chat.content && chat.type === "chat" && (
						<>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className={
											selectedLanguage ? "bg-muted" : ""
										}
										disabled={isTranslating}
									>
										<GlobeIcon className="size-4 mr-1" />
										{isTranslating
											? translateT("translating")
											: selectedLanguage
											? `${translateT(
													"alreadyTranslated"
											  )} ${languageOptions.find(
													(l) =>
														l === selectedLanguage
											  )}`
											: translateT("tooltip")}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{selectedLanguage ? (
										<DropdownMenuItem
											onClick={resetTranslation}
										>
											{translateT("showOriginal")}
										</DropdownMenuItem>
									) : (
										languageOptions.map((lang) => (
											<DropdownMenuItem
												key={lang}
												onClick={() =>
													handleTranslate(lang)
												}
											>
												{lang}
											</DropdownMenuItem>
										))
									)}
								</DropdownMenuContent>
							</DropdownMenu>
							<Separator
								orientation="vertical"
								className="!h-4"
							/>
						</>
					)}

					{children}

					{/* 删除 */}
					{chat.type !== "chat" && (
						<>
							<Separator
								orientation="vertical"
								className="!h-4"
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleDelete}
							>
								<XIcon className="size-4" />
							</Button>
						</>
					)}
				</div>

				{/* 显示翻译结果 */}
				{translatedContent && (
					<div className="mt-2 pt-2 border-t border-border">
						<div className=" whitespace-pre-wrap">
							{translatedContent}
						</div>
					</div>
				)}
			</>
		);
	}
};

export default MessageControl;
