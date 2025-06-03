import { create } from "zustand";
import { type AiConfig } from "../app/core/setting/config";
import { Store } from "@tauri-apps/plugin-store";

interface ModelState {
	models: AiConfig[];
	initModels: () => Promise<void>;
}

const useModelStore = create<ModelState>((set) => ({
	models: [],
	initModels: async () => {
		const store = await Store.load("store.json");
		const models = await store.get<AiConfig[]>("models");
		if (!models) return;
		set({ models });
	},
}));

export default useModelStore;
