import React, { useMemo, useState } from "react";
import SettingType from "../components/SettingType";
import { useTranslations } from "next-intl";
import SettingRow from "../components/SettingRow";
import FormItem from "../components/FormItem";
import { useDebounceFn, useMount, useUpdateEffect } from "@reactuses/core";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useModelStore from "@/stores/model";
import { type AiConfig } from "../config";
import useSettingStore from "@/stores/setting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { v4 } from "uuid";
import { confirm } from "@tauri-apps/plugin-dialog";
import ModelSelect from "./ModelSelect";

interface SettingAIProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingAI = ({ id, icon }: SettingAIProps) => {
	const t = useTranslations("settings.ai");
	const [currentAi, setCurrentAi] = useState<AiConfig | undefined>(undefined);
	const [title, setTitle] = useState<string>("");
	const {
		models,
		getModels,
		saveModelByStore,
		getModelByStore,
		initModels,
		deleteModels,
	} = useModelStore();
	const {
		aiType,
		baseURL,
		apiKey,
		temperature,
		topP,
		setAiType,
		setModel,
		setBaseURL,
		setApiKey,
		setTemperature,
		setTopP,
	} = useSettingStore();

	const [customModels, buildInModels] = useMemo(() => {
		const cList = [];
		const bList = [];
		for (const model of models) {
			if (model.type === "custom") {
				cList.push(model);
			} else {
				bList.push(model);
			}
		}
		return [cList, bList];
	}, [models]);

	// 模型选择变更
	const selectChangeHandler = (key: string) => {
		const model = models.find((item) => item.key === key);
		if (!model) return;
		setAiType(key);
		setCurrentAi(model);
	};

	// 删除自定义模型
	const deleteCustomModelHandler = async () => {
		const res = await confirm(t("deleteCustomModelConfirm"));
		if (!res) return;
		const newModels = await deleteModels(aiType);
		const first = newModels[0];
		if (!first) return;
		setAiType(first.key);
		setCurrentAi(first);
	};

	// 添加自定义模型;
	const addCustomModelHandler = async () => {
		const id = v4();
		const newModel: AiConfig = {
			key: id,
			baseURL: "",
			type: "custom",
			title: "Untitled",
			temperature: 0.7,
			topP: 1.0,
		};
		setAiType(id);
		setCurrentAi(newModel);
		await saveModelByStore(newModel);
		getModels();
	};

	// 复制当前配置
	const copyConfig = async () => {
		const model = await getModelByStore(aiType);
		if (!model) return;
		const id = v4();
		const newModel: AiConfig = {
			...model,
			key: id,
			title: `${model.title || "Copy"} (Copy)`,
			type: "custom",
		};
		setAiType(id);
		setCurrentAi(newModel);
		await saveModelByStore(newModel);
		getModels();
	};

	// 自定义名称
	const titleChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setTitle(e.target.value);
		const model = await getModelByStore(aiType);
		if (!model) return;
		model.title = e.target.value;
		await saveModelByStore(model);
		debounceGetModels();
	};

	// 基础 URL 变更
	const baseURLChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setBaseURL(value);
		updateModelStore(aiType, "baseURL", value);
	};

	// API Key 变更
	const apiKeyChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setApiKey(value);
		updateModelStore(aiType, "apiKey", value);
	};

	// temperature 变更处理
	const temperatureChangeHandler = async (value: number[]) => {
		setTemperature(value[0]);
		updateModelStore(aiType, "temperature", value[0]);
	};

	// topP 变更处理
	const topPChangeHandler = async (value: number[]) => {
		setTopP(value[0]);
		updateModelStore(aiType, "topP", value[0]);
	};

	// 防抖
	const { run: updateModelStore } = useDebounceFn(
		async (aiType: string, key: string, value: any) => {
			const model = await getModelByStore(aiType);
			if (!model) return;
			(model as any)[key] = value;

			saveModelByStore(model);
		},
		200
	);
	const { run: debounceGetModels } = useDebounceFn(() => {
		getModels();
	}, 200);

	useMount(() => {
		initModels();
	});

	useUpdateEffect(() => {
		const update = async () => {
			if (!models) return;
			const model = await getModelByStore(aiType);
			if (!model) return;
			setCurrentAi(model);
			setApiKey(model.apiKey ?? "");
			setBaseURL(model.baseURL ?? "");
			setModel(model.model ?? "");
			if (model.type === "custom") {
				setTitle(model.title || "");
			}
			setTemperature(model.temperature);
			setTopP(model.topP);
		};
		update();
	}, [models, aiType]);

	return (
		<SettingType id={id} icon={icon} title={t("title")} desc={t("desc")}>
			<SettingRow>
				<FormItem title="Model Provider" desc={t("modelProviderDesc")}>
					<div className="flex gap-2 items-center">
						<Select
							value={aiType}
							onValueChange={selectChangeHandler}
						>
							<SelectTrigger className="w-[240px] flex">
								<div className="flex items-center gap-2">
									<SelectValue placeholder="Select a fruit" />
								</div>
							</SelectTrigger>
							<SelectContent>
								{customModels.length > 0 && (
									<SelectGroup>
										<SelectLabel>{t("custom")}</SelectLabel>
										{customModels.map((item) => (
											<SelectItem
												key={item.key}
												value={item.key}
											>
												{item.title}
											</SelectItem>
										))}
									</SelectGroup>
								)}
								<SelectGroup>
									<SelectLabel>{t("builtin")}</SelectLabel>
									{buildInModels.map((item) => (
										<SelectItem
											value={item.key}
											key={item.key}
										>
											{item.title}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						{currentAi?.type === "custom" && (
							<Button
								variant="destructive"
								onClick={deleteCustomModelHandler}
							>
								{t("deleteCustomModel")}
							</Button>
						)}
						<Button onClick={addCustomModelHandler}>
							{t("addCustomModel")}
						</Button>
						{/* 复制当前配置 */}
						<Button onClick={copyConfig}>{t("copyConfig")}</Button>
					</div>
				</FormItem>
			</SettingRow>
			{currentAi?.type === "custom" && (
				<SettingRow>
					<FormItem
						title={t("modelTitle")}
						desc={t("modelTitleDesc")}
					>
						<Input value={title} onChange={titleChangeHandler} />
					</FormItem>
				</SettingRow>
			)}
			<SettingRow>
				<FormItem title="BaseUrl" desc={t("modelBaseUrlDesc")}>
					<Input value={baseURL} onChange={baseURLChangeHandler} />
				</FormItem>
			</SettingRow>
			<SettingRow>
				<FormItem title="API Key">
					<Input value={apiKey} onChange={apiKeyChangeHandler} />
				</FormItem>
			</SettingRow>
			<SettingRow>
				<FormItem title="Model" desc={t("modelDesc")}>
					<ModelSelect />
					<div></div>
				</FormItem>
			</SettingRow>
			<SettingRow>
				<FormItem title="Temperature" desc={t("temperatureDesc")}>
					<div className="flex gap-2 py-2">
						<Slider
							className="w-64"
							value={[temperature]}
							max={2}
							step={0.01}
							onValueChange={temperatureChangeHandler}
						/>
						<span className="text-zinc-500">{temperature}</span>
					</div>
				</FormItem>
			</SettingRow>
			<SettingRow>
				<FormItem title="Top P" desc={t("topPDesc")}>
					<div className="flex gap-2 py-2">
						<Slider
							className="w-64"
							value={[topP]}
							max={1}
							min={0}
							step={0.01}
							onValueChange={topPChangeHandler}
						/>
						<span className="text-zinc-500">{topP}</span>
					</div>
				</FormItem>
			</SettingRow>
		</SettingType>
	);
};

export default SettingAI;
