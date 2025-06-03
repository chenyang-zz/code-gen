import { TooltipButton } from "@/components/TooltipButton";
import { FilePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ControllerFile = () => {
	const t = useTranslations();
	return (
		<TooltipButton
			icon={<FilePlus />}
			tooltipText={t("record.mark.type.file")}
		/>
	);
};

export default ControllerFile;
