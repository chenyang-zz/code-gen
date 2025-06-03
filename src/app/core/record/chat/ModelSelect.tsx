import { TooltipButton } from "@/components/TooltipButton";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { BotMessageSquare, BotOff, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import useModelStore from "@/stores/model";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { CommandGroup } from "cmdk";
import useSettingStore from "@/stores/setting";
import { cn } from "@/lib/utils";

const ModelSelect = () => {
	const t = useTranslations("record.chat.input.modelSelect");
	const [open, setOpen] = useState(false);
	const { initModels, models } = useModelStore();
	const { aiType, setAiType, setModel, setApiKey, setBaseURL } =
		useSettingStore();

	const list = useMemo(() => {
		return models.filter(
			(item) => item.apiKey && item.model && item.baseURL
		);
	}, [models]);

	const modelSelectChangeHandler = (key: string) => {
		setAiType(key);
		const model = models.find((item) => item.key === key);
		if (!model) return;
		setModel(model.model ?? "");
		setApiKey(model.apiKey ?? "");
		setBaseURL(model.baseURL ?? "");
	};

	useEffect(() => {
		initModels();
	}, []);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div>
					<TooltipButton
						icon={
							list.length > 0 ? (
								<BotMessageSquare className="size-4" />
							) : (
								<BotOff className="size-4" />
							)
						}
						tooltipText={t("tooltip")}
						size="icon"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-[360px] p-0">
				<Command>
					<CommandInput
						className="h-9"
						placeholder={t("placeholder")}
					/>
					<CommandList>
						<CommandEmpty>No model find.</CommandEmpty>
						<CommandGroup>
							{list.map((item) => (
								<CommandItem
									key={item.key}
									value={item.key}
									onSelect={(currentValue) => {
										modelSelectChangeHandler(currentValue);
										setOpen(false);
									}}
								>
									{`${item.model}(${item.title})`}
									<Check
										className={cn(
											"ml-auto",
											aiType === item.key
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

export default ModelSelect;
