import { create } from "zustand";
import { baseAiConfig, type AiConfig } from "@/app/core/setting/config";
import { Store } from "@tauri-apps/plugin-store";

interface ModelState {
	models: AiConfig[];
	initModels: () => Promise<void>;
	getModels: () => Promise<AiConfig[]>;
	deleteModels: (key: string) => Promise<AiConfig[]>;

	getModelByStore: (key: string) => Promise<AiConfig | undefined>;
	saveModelByStore: (model: AiConfig) => Promise<void>;
}

const useModelStore = create<ModelState>((set) => ({
	models: [],
	initModels: async () => {
		const store = await Store.load("store.json");
		const models = await store.get<AiConfig[]>("aiModelList");
		if (models) {
			baseAiConfig.forEach(async (item) => {
				if (
					models!.findIndex((model) => model.key === item.key) === -1
				) {
					models!.push(item);
				}
			});
			await store.set("aiModelList", models);
			set({ models });
		} else {
			await store.set("aiModelList", baseAiConfig);
			set({ models: baseAiConfig });
		}
	},
	getModels: async () => {
		const store = await Store.load("store.json");
		const models = await store.get<AiConfig[]>("aiModelList");
		if (!models) return [];
		set({ models });
		return models;
	},
	deleteModels: async (key: string) => {
		const store = await Store.load("store.json");
		const models = await store.get<AiConfig[]>("aiModelList");
		if (!models) return [];
		models.splice(
			models.findIndex((item) => item.key === key),
			1
		);
		await store.set("aiModelList", models);
		set({ models });
		return models;
	},

	getModelByStore: async (key: string) => {
		const store = await Store.load("store.json");
		const models = await store.get<AiConfig[]>("aiModelList");
		if (!models) return;
		return models?.find((item) => item.key === key);
	},
	saveModelByStore: async (model: AiConfig) => {
		const store = await Store.load("store.json");
		const models = await store.get<AiConfig[]>("aiModelList");
		if (!models) return;
		const index = models.findIndex((item) => item.key === model.key);
		if (index === -1) {
			models.push(model);
		} else {
			models[index] = model;
		}
		await store.set("aiModelList", models);
	},
}));

export default useModelStore;
