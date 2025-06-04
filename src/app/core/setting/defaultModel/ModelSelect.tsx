import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import useModelStore from "@/stores/model";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { useMount } from "ahooks";
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
			</div>
		</Popover>
	);
};

export default ModelSelect;
