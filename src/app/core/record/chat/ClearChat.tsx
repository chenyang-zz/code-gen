import { TooltipButton } from "@/components/TooltipButton";
import useChatStore from "@/stores/chat";
import useTagStore from "@/stores/tag";
import { Eraser } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ClearChat = () => {
	const t = useTranslations();
	const { clearChats } = useChatStore();
	const { currentTagId } = useTagStore();

	const clearHandler = () => {
		clearChats(currentTagId);
	};

	return (
		<TooltipButton
			icon={<Eraser />}
			tooltipText={t("record.chat.input.clearChat")}
			onClick={clearHandler}
		/>
	);
};

export default ClearChat;
