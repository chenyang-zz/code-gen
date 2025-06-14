import { TooltipButton } from "@/components/TooltipButton";
import useChatStore from "@/stores/chat";
import useTagStore from "@/stores/tag";
import { AlignVerticalJustifyCenter } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ClearContext = () => {
	const t = useTranslations("record.chat.input.clearContext");
	const { createChat } = useChatStore();
	const { currentTagId } = useTagStore();

	const handleClearContext = () => {
		// 插入一条系统消息，表示清除上下文
		createChat({
			tagId: currentTagId,
			role: "system",
			content: "上下文已清除，之后的对话将只携带此消息之后的内容。",
			type: "clear",
			inserted: true,
			image: undefined,
		});
	};

	return (
		<TooltipButton
			variant="ghost"
			size="icon"
			icon={<AlignVerticalJustifyCenter className="size-4" />}
			tooltipText={t("tooltip")}
			onClick={handleClearContext}
		/>
	);
};

export default ClearContext;
