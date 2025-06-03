import { TooltipButton } from "@/components/TooltipButton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const RemoveChat = () => {
	const t = useTranslations("record.chat");
	const ct = useTranslations("common");
	const [open, setOpen] = useState(false);
	const [isFirstTag, setIsFirstTag] = useState(false);

	const confirmRemoveChat = () => {};

	return (
		<>
			<TooltipButton
				disabled={isFirstTag}
				icon={<Trash2 />}
				tooltipText={t("removeChat")}
				onClick={() => setOpen(true)}
			/>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("confirmRemove")}
						</AlertDialogTitle>
						<AlertDialogDescription className="text-red-500">
							{t("confirmRemoveDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{ct("cancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={confirmRemoveChat}>
							{ct("confirm")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default RemoveChat;
