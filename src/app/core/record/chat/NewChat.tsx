import { TooltipButton } from "@/components/TooltipButton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { insertTag } from "@/db/tags";
import useMarkStore from "@/stores/mark";
import useTagStore from "@/stores/tag";
import { MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const NewChat = () => {
	const t = useTranslations("record.chat");
	const ct = useTranslations("common");
	const [name, setName] = useState("Untitled Chat");
	const [open, setOpen] = useState(false);

	const { setCurrentTagId, fetchTags, getCurrentTag } = useTagStore();
	const { fetchMarks } = useMarkStore();

	const confirmCreateNewChat = async () => {
		const res = await insertTag({ name });
		await setCurrentTagId(res.lastInsertId as number);
		await fetchTags();
		getCurrentTag();
		fetchMarks();
		setOpen(false);
		setName("Untitled Chat");
	};

	return (
		<>
			<TooltipButton
				icon={<MessageSquarePlus />}
				tooltipText={t("newChat")}
				onClick={() => setOpen(true)}
			/>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("confirmNew")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("confirmNewDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					{/* 输入框 */}
					<div>
						<Input
							placeholder="Tag Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>{ct("cancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={confirmCreateNewChat}>
							{ct("confirm")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default NewChat;
