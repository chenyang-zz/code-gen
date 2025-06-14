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
import usePromptStore from "@/stores/prompt";
import { useMount } from "@reactuses/core";
import { Check, Drama } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const PromptSelect = () => {
	const t = useTranslations("record.chat.input.promptSelect");
	const [open, setOpen] = useState(false);
	const { promptList, currentPrompt, setCurrentPrompt, initPromptData } =
		usePromptStore();

	// 选择 Prompt
	const promptSelectChangeHandler = async (id: string) => {
		const selectedPrompt = promptList.find((item) => item.id === id);
		if (!selectedPrompt) return;
		await setCurrentPrompt(selectedPrompt);
	};

	useMount(() => {
		initPromptData();
	});
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div>
					<TooltipButton
						icon={<Drama />}
						tooltipText={t("tooltip")}
						size="icon"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-[180px] p-0">
				<Command>
					<CommandInput
						placeholder={t("tooltip")}
						className="h-9"
					></CommandInput>
					<CommandList>
						<CommandEmpty>No Prompt find.</CommandEmpty>
						<CommandGroup>
							{promptList.map((item) => (
								<CommandItem
									key={item.id}
									value={item.id}
									onSelect={(currentValue) => {
										promptSelectChangeHandler(currentValue);
										setOpen(false);
									}}
								>
									{item.title}
									<Check
										className={cn(
											"ml-auto",
											currentPrompt?.id === item.id
												? "opacity-100"
												: "opacity-0"
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

export default PromptSelect;
