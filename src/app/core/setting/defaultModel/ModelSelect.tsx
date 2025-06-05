import { TooltipButton } from "@/components/TooltipButton";
import { Button } from "@/components/ui/button";
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
import useModelStore from "@/stores/model";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { useMount } from "ahooks";
import { Check, Redo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

interface ModelSelectProps {
	modelKey: string;
}

const ModelSelect = ({ modelKey }: ModelSelectProps) => {
	const t = useTranslations("settings.defaultModel");
	const [open, setOpen] = useState(false);
	const [model, setModel] = useState<string>("");
	const { models, initModels } = useModelStore();
	const { setPlaceholderModel, setTranslateModel, setMarkDescModel } =
		useSettingStore();

	const list = useMemo(() => {
		return models.filter(
			(item) => item.apiKey && item.model && item.baseURL
		);
	}, [models]);

	function setAiType(aiType: string) {
		setModel(aiType);
		switch (modelKey) {
			case "placeholder":
				setPlaceholderModel(aiType);
				break;
			case "translate":
				setTranslateModel(aiType);
				break;
			case "markDesc":
				setMarkDescModel(aiType);
				break;
			default:
				break;
		}
	}

	const resetDefaultModel = async () => {
		const store = await Store.load("store.json");
		store.set(`${modelKey}AiType`, "");
		setAiType("");
	};

	const modelSelectChangeHandler = async (key: string) => {
		setAiType(key);
		const store = await Store.load("store.json");
		store.set(`${modelKey}AiType`, key);
	};

	useMount(() => {
		const init = async () => {
			initModels();
			const store = await Store.load("store.json");
			const aiType = await store.get<string>(`${modelKey}AiType`);
			if (!aiType) return;
			setAiType(aiType);
		};
		init();
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div className="flex gap-2">
				<PopoverTrigger asChild>
					<div>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-[480px] justify-between"
						>
							{model
								? `${
										list.find((item) => item.key === model)
											?.model
								  }(${
										list.find((item) => item.key === model)
											?.title
								  })`
								: t("tooltip")}
						</Button>
					</div>
				</PopoverTrigger>
				{model && (
					<TooltipButton
						icon={<Redo2 className="size-4" />}
						variant="default"
						tooltipText={t("tooltip")}
						onClick={resetDefaultModel}
					/>
				)}
			</div>
			<PopoverContent align="start" className="w-[480px] p-0">
				<Command>
					<CommandInput
						placeholder={t("placeholder")}
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty />
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
											model === item.key
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
