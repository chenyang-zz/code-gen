import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ChatEmpty from "./ChatEmpty";
import useChatStore from "@/stores/chat";
import { type Chat } from "@/db/chats";
import {
	ArrowDownToLine,
	BotMessageSquare,
	ClipboardCheck,
	LoaderPinwheel,
	Undo2,
	UserRound,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import ChatClipboard from "./ChatClipboard";
import ChatThinking from "./ChatThinking";
import { cn } from "@/lib/utils";
import ChatPreview from "./ChatPreview";
import MessageControl from "./MessageControl";
import NoteOutput from "./NoteOutput";
import MarkText from "./MarkText";
import { useMount, useUpdateEffect } from "@reactuses/core";
import { scrollToBottom } from "@/lib/workspace";
import useTagStore from "@/stores/tag";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useSyncStore from "@/stores/sync";
import emitter from "@/lib/emitter";

const ChatContent = () => {
	const [isOnBottom, setIsOnBottom] = useState(true);
	const { chats, init } = useChatStore();
	const { currentTagId } = useTagStore();
	const mdRef = useRef<HTMLDivElement>(null);

	const handleScroll = useCallback(() => {
		if (!mdRef.current) return;
		setIsOnBottom(
			mdRef.current.scrollHeight -
				mdRef.current.scrollTop -
				mdRef.current.clientHeight <
				1
		);
	}, []);

	useMount(() => {
		mdRef.current?.addEventListener("scroll", handleScroll);
		setTimeout(() => {
			scrollToBottom();
		}, 1000);
		return () => mdRef.current?.removeEventListener("scroll", handleScroll);
	});

	useEffect(() => {
		init(currentTagId);
	}, [currentTagId]);

	useEffect(() => {
		if (!isOnBottom) return;
		scrollToBottom();
	}, [chats]);

	return (
		<div
			ref={mdRef}
			id="chats-wrapper"
			className="flex-1 relative overflow-y-auto overflow-x-hidden w-full flex flex-col items-end p-4 gap-6"
		>
			{chats.length ? (
				chats.map((chat) => <Message key={chat.id} chat={chat} />)
			) : (
				<ChatEmpty />
			)}
			{!isOnBottom && (
				<Button
					variant="outline"
					className="sticky bottom-0 size-4 right-0"
					onClick={scrollToBottom}
				>
					<ArrowDownToLine className="size-4" />
				</Button>
			)}
		</div>
	);
};

const MessageWrapper = ({
	chat,
	children,
}: {
	chat: Chat;
	children: React.ReactNode;
}) => {
	const { chats, loading } = useChatStore();
	const { userInfo } = useSyncStore();
	const index = useMemo(() => {
		return chats.findIndex((item) => item.id === chat.id);
	}, [chat, chats]);

	const revertChat = () => {
		emitter.emit("revertChat", chat.content);
	};

	if (chat.role === "system") {
		return (
			<div className="flex gap-4 w-full">
				{loading &&
				index === chats.length - 1 &&
				chat.type === "chat" ? (
					<LoaderPinwheel className="animate-spin" />
				) : chat.type === "clipboard" ? (
					<ClipboardCheck />
				) : (
					<BotMessageSquare />
				)}
				<div className="text-sm leading-6 flex-1 max-w-[calc(100vw-460px)] break-words">
					{children}
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex group items-center gap-4">
				<div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg max-w-[calc(100vw-600px)]">
					{chat.content}
				</div>
				<div className="relative">
					<Avatar className="rounded size-9 flex items-center justify-center">
						{userInfo?.avatar_url ? (
							<AvatarImage src={userInfo.avatar_url} />
						) : (
							<UserRound />
						)}
					</Avatar>
					<Button
						className=" absolute top-0 ring-0 hidden group-hover:flex"
						size="icon"
						onClick={revertChat}
					>
						<Undo2 />
					</Button>
				</div>
			</div>
		);
	}
};

const Message = ({ chat }: { chat: Chat }) => {
	const t = useTranslations("record.chat");
	const { deleteChat } = useChatStore();
	const content = chat.content?.includes("thinking")
		? chat.content.split("<thinking>")[2]
		: chat.content;

	const handleRemoveClearContext = () => {
		deleteChat(chat.id);
	};

	switch (chat.type) {
		case "clear":
			return (
				<div className="w-full flex justify-center items-center gap-4 px-10">
					<Separator className="flex-1" />
					<div className="flex justify-center items-center gap-2 w-32 group h-8">
						<p className="text-sm text-center text-muted-foreground">
							{t("input.clearContext.tooltip")}
						</p>
						<X
							className="size-4 hidden group-hover:flex cursor-pointer"
							onClick={handleRemoveClearContext}
						/>
					</div>
					<Separator className="flex-1" />
				</div>
			);
		case "clipboard":
			return (
				<MessageWrapper chat={chat}>
					<ChatClipboard chat={chat} />
				</MessageWrapper>
			);
		case "note":
			return (
				<MessageWrapper chat={chat}>
					<div className="w-full overflow-x-hidden">
						<div className="flex justify-between">
							<p>{t("content.organize")}</p>
						</div>
						<ChatThinking chat={chat} />
						<div
							className={cn(
								content &&
									"note-wrapper border w-full overflow-y-auto overflow-x-hidden my-2 p-4 rounded-lg"
							)}
						>
							<ChatPreview text={content || ""} />
						</div>
						<MessageControl chat={chat}>
							<NoteOutput chat={chat} />
						</MessageControl>
					</div>
				</MessageWrapper>
			);
		default:
			return (
				<MessageWrapper chat={chat}>
					<ChatThinking chat={chat} />
					<ChatPreview text={content || ""} />
					<MessageControl chat={chat}>
						<MarkText chat={chat} />
					</MessageControl>
				</MessageWrapper>
			);
	}
};

export default ChatContent;
