import type { Chat } from "@/db/chats";
import React from "react";

interface MessageControlProps {
	chat: Chat;
	children: React.ReactNode;
}

const MessageControl = ({}: MessageControlProps) => {
	return <div>MessageControl</div>;
};

export default MessageControl;
