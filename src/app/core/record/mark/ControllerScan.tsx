import { TooltipButton } from "@/components/TooltipButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ScanText } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const ControllerScan = () => {
	const t = useTranslations();
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<TooltipButton
					icon={<ScanText />}
					tooltipText={t("record.mark.type.screenshot")}
				/>
			</DialogTrigger>
		</Dialog>
	);
};

export default ControllerScan;
