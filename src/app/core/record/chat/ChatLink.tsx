import { TooltipButton } from "@/components/TooltipButton";
import useChatStore from "@/stores/chat";
import useMarkStore from "@/stores/mark";
import useTagStore from "@/stores/tag";
import { Link, Unlink } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface ChatLinkProps {
	inputType?: string | null;
}

const ChatLink = ({ inputType }: ChatLinkProps) => {
	const t = useTranslations("record.chat.input.tagLink");
	const { currentTag } = useTagStore();
	const { marks } = useMarkStore();
	const { isLinkMark, setIsLinkMark } = useChatStore();
	return (
		<TooltipButton
			icon={isLinkMark ? <Link /> : <Unlink />}
			tooltipText={
				isLinkMark
					? `${t("on")} ${currentTag?.name}(${marks.length})`
					: t("off")
			}
			size="icon"
			disabled={marks.length === 0 || inputType === "gen"}
			onClick={() => setIsLinkMark(!isLinkMark)}
		/>
	);
};

export default ChatLink;
