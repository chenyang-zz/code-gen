import { Button } from "@/components/ui/button";
import type { Chat } from "@/db/chats";
import { insertMark } from "@/db/marks";
import useChatStore from "@/stores/chat";
import useMarkStore from "@/stores/mark";
import useTagStore from "@/stores/tag";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface MarkTextProps {
	chat: Chat;
}

const MarkText = ({ chat }: MarkTextProps) => {
	const t = useTranslations("record.chat");
	const { currentTagId, fetchTags, getCurrentTag } = useTagStore();
	const { fetchMarks } = useMarkStore();
	const { updateInsert, chats } = useChatStore();

	const handleSuccess = async () => {
		const currentIndex = chats.findIndex((item) => item.id === chat.id);
		const prevChat = chats[currentIndex - 1];
		const res = `
${prevChat?.content}
${chat.content}
`;
		const resetText = res.replace(/'/g, "");
		await insertMark({
			tagId: currentTagId,
			type: "text",
			desc: resetText,
			content: resetText,
		});
		updateInsert(chat.id);
		await fetchMarks();
		await fetchTags();
		getCurrentTag();
	};

	return chat.inserted ? (
		<Button variant="ghost" size="sm" disabled>
			<CheckCircle className="size-4" />
			{t("mark.recorded")}
		</Button>
	) : (
		<Button variant="ghost" size="sm" onClick={handleSuccess}>
			<CheckCircle className="size-4" />
			{t("mark.record")}
		</Button>
	);
};

export default MarkText;
