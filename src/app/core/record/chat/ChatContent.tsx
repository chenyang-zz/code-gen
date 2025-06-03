import React, { useMemo } from "react";
import ChatEmpty from "./ChatEmpty";
import useChatStore from "@/stores/chat";
import { type Chat } from "@/db/chats";
import { BotMessageSquare, ClipboardCheck, LoaderPinwheel } from "lucide-react";

const ChatContent = () => {
	const { chats } = useChatStore();
	return (
		<div
			id="chats-wrapper"
			className="flex-1 relative overflow-y-auto overflow-x-hidden w-full flex flex-col items-end p-4 gap-6"
		>
			{chats.length ? (
				chats.map((chat) => <Message key={chat.id} chat={chat} />)
			) : (
				<ChatEmpty />
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

	const index = useMemo(() => {
		return chats.findIndex((item) => item.id === chat.id);
	}, [chat, chats]);

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
		return <div className="flex group items-center gap-4"></div>;
	}
};

const Message = ({ chat }: { chat: Chat }) => {
	return <div></div>;
};

export default ChatContent;
