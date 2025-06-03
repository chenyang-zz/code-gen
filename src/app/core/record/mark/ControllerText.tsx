import { TooltipButton } from "@/components/TooltipButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CopySlash } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ControllerText = () => {
	const t = useTranslations();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<TooltipButton
					icon={<CopySlash />}
					tooltipText={t("record.mark.type.text")}
				/>
			</DialogTrigger>
		</Dialog>
	);
};

export default ControllerText;
