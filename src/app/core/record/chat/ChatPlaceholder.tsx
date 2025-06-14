import { TooltipButton } from "@/components/TooltipButton";
import useChatStore from "@/stores/chat";
import { useLocalStorage, useMount } from "@reactuses/core";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const ChatPlaceholder = () => {
	const t = useTranslations("record.chat.input.placeholder");
	const [storedValue, setStoredValue] = useLocalStorage(
		"chat-placeholder-enabled",
		true
	);
	const { isPlaceholderEnabled, setIsPlaceholderEnabled } = useChatStore();

	const togglePlaceholder = () => {
		const newValue = !isPlaceholderEnabled;
		setIsPlaceholderEnabled(newValue);
		setStoredValue(newValue);
	};

	useMount(() => {
		if (storedValue !== undefined && storedValue !== isPlaceholderEnabled) {
			setIsPlaceholderEnabled(!!storedValue);
		}
	});

	return (
		<TooltipButton
			icon={
				isPlaceholderEnabled ? (
					<Lightbulb className="size-4" />
				) : (
					<LightbulbOff className="size-4" />
				)
			}
			tooltipText={isPlaceholderEnabled ? t("on") : t("off")}
			size="icon"
			onClick={togglePlaceholder}
		/>
	);
};

export default ChatPlaceholder;
