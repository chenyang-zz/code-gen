import { TooltipButton } from "@/components/TooltipButton";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ControllerImage = () => {
	const t = useTranslations();
	return (
		<TooltipButton
			icon={<ImagePlus />}
			tooltipText={t("record.mark.type.image")}
		/>
	);
};

export default ControllerImage;
