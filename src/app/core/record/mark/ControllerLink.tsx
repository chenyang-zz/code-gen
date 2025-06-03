import { TooltipButton } from "@/components/TooltipButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ControllerLink = () => {
	const t = useTranslations();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<TooltipButton
					icon={<Link />}
					tooltipText={t("record.mark.type.link") || "链接"}
				/>
			</DialogTrigger>
		</Dialog>
	);
};

export default ControllerLink;
