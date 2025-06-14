import { TooltipButton } from "@/components/TooltipButton";
import Store from "@/lib/store";
import { useMount } from "@reactuses/core";
import { Clipboard, ClipboardX } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const ClipboardMonitor = () => {
	const t = useTranslations("record.chat.input.clipboardMonitor");
	const [isEnabled, setIsEnabled] = useState(true);

	const toggleClipboardMonitor = async () => {
		const newState = !isEnabled;
		setIsEnabled(newState);
		Store.set("clipboardMonitor", newState);
	};

	useMount(async () => {
		const value = await Store.get<boolean>("clipboardMonitor");
		if (value !== undefined && value !== isEnabled) {
			setIsEnabled(value);
		}
	});

	return (
		<TooltipButton
			variant="ghost"
			size="icon"
			icon={
				isEnabled ? (
					<Clipboard className="size-4" />
				) : (
					<ClipboardX className="size-4" />
				)
			}
			tooltipText={isEnabled ? t("enable") : t("disable")}
			onClick={toggleClipboardMonitor}
		/>
	);
};

export default ClipboardMonitor;
