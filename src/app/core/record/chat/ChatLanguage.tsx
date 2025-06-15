import { TooltipButton } from "@/components/TooltipButton";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMount } from "@reactuses/core";
import { Store } from "@tauri-apps/plugin-store";
import { Check, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export const languageOptions = [
	"English",
	"中文",
	"日本語",
	"한국어",
	"Français",
	"Deutsch",
	"Español",
	"Русский",
];

const ChatLanguage = () => {
	const t = useTranslations("record.chat.input.chatLanguage");
	const [open, setOpen] = React.useState(false);
	const [chatLanguage, setChatLanguage] = useState("中文");

	const getCurrentLanguageName = () => {
		const lang = languageOptions.find((l) => l === chatLanguage);
		return lang ? lang : "English";
	};

	const initChatLanguage = async () => {
		const store = await Store.load("store.json");
		const chatLanguage = await store.get<string>("chatLanguage");
		if (chatLanguage) {
			setChatLanguage(chatLanguage);
		} else {
			const appLocale = (await store.get<string>("locale")) || "中文";
			setChatLanguage(appLocale);
			await store.set("chatLanguage", appLocale);
		}
	};

	const languageSelectChangeHandler = async (lang: string) => {
		setChatLanguage(lang);
		const store = await Store.load("store.json");
		await store.set("chatLanguage", lang);
	};

	useMount(() => {
		initChatLanguage();
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div>
					<TooltipButton
						icon={
							<Globe
								className={cn(
									"size-4",
									chatLanguage && "text-primary"
								)}
							/>
						}
						tooltipText={
							(t("tooltip") || "Select chat language") +
							getCurrentLanguageName()
						}
						size="icon"
						variant="ghost"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-[240px] p-0">
				<Command>
					<CommandInput
						className="h-9"
						placeholder={t("placeholder") || "Search language..."}
					/>
					<CommandList>
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{languageOptions.map((lang) => (
								<CommandItem
									key={lang}
									value={lang}
									onSelect={(currentValue) => {
										languageSelectChangeHandler(
											currentValue
										);
										setOpen(false);
									}}
								>
									{lang}
									<Check
										className={cn(
											"ml-auto",
											chatLanguage !== lang && "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ChatLanguage;
