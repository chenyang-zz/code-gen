import { BotMessageSquare, Drama } from "lucide-react";
import React from "react";
import NewChat from "./NewChat";
import RemoveChat from "./RemoveChat";
import usePromptStore from "@/stores/prompt";
import useSettingStore from "@/stores/setting";

const ChatHeader = () => {
	const { currentPrompt } = usePromptStore();
	const { aiType, model } = useSettingStore();
	return (
		<header className="h-12 w-full grid grid-cols-[auto_1fr_auto] items-center border-b px-4 text-sm">
			<div className="flex items-center gap-1">
				<Drama className="size-4" />
				{currentPrompt?.title}
			</div>
			<div className="flex items-center justify-center gap-1">
				<BotMessageSquare className="size-4" />
				{`${model}(${aiType})`}
			</div>
			<div className="flex items-center gap-1">
				<NewChat />
				<RemoveChat />
			</div>
		</header>
	);
};

export default ChatHeader;
