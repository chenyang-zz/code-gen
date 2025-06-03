import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";

const Chat = () => {
	return (
		<main className="flex flex-col flex-1 relative items-center h-screen overflow-hidden dark:bg-zinc-950">
			<ChatHeader />
			<ChatContent />
			<ChatInput />
		</main>
	);
};

export default Chat;
