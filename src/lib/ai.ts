import { AiConfig } from "@/app/core/setting/config";
import { Store } from "@tauri-apps/plugin-store";
import OpenAI from "openai";

/**
 * 获取AI设置
 */
async function getAISettings() {
	const store = await Store.load("store.json");
	const baseURL = await store.get<string>("baseURL");
	const apiKey = await store.get<string>("apiKey");
	const model = (await store.get<string>("model")) ?? "gpt-3.5-turbo";
	const aiType = (await store.get<string>("aiType")) ?? "openai";
	const temperature = (await store.get<number>("temperature")) ?? 0.7;
	const topP = (await store.get<number>("topP")) ?? 1;
	const chatLanguage = (await store.get<string>("chatLanguage")) ?? "en";
	const proxyUrl = await store.get<string>("proxy");

	return {
		baseURL,
		apiKey,
		model,
		aiType,
		temperature,
		topP,
		chatLanguage,
		proxyUrl,
	};
}

/**
 * 创建OpenAI客户端，适用于所有AI类型
 */
async function createOpenAIClient(config?: AiConfig) {
	const store = await Store.load("store.json");
	let baseURL;
	let apiKey;
	if (config) {
		baseURL = config.baseURL;
		apiKey = config.apiKey;
	} else {
		baseURL = await store.get<string>("baseURL");
		apiKey = await store.get<string>("apiKey");
	}

	const proxyUrl = await store.get<string>("proxy");

	// 创建OpenAI客户端
	return new OpenAI({
		apiKey: apiKey ?? "",
		baseURL: baseURL ?? "",
		dangerouslyAllowBrowser: true,
		defaultHeaders: {
			"x-stainless-arch": null,
			"x-stainless-lang": null,
			"x-stainless-os": null,
			"x-stainless-package-version": null,
			"x-stainless-retry-count": null,
			"x-stainless-runtime": null,
			"x-stainless-runtime-version": null,
			"x-stainless-timeout": null,
		},
		...(proxyUrl ? { httpAgent: proxyUrl } : {}),
	});
}

/**
 * 获取模型
 */
export async function getModels() {
	console.log("213414");
	try {
		// 获取AI设置
		const { baseURL, aiType } = await getAISettings();

		if (!baseURL || !aiType) return [];

		if (aiType === "gemini") {
			return [];
		} else {
			// OpenAI/Ollama模型列表
			const openai = await createOpenAIClient();
			const models = await openai.models.list();
			const uniqueModels = models.data.filter(
				(model, index) =>
					models.data.findIndex((m) => m.id === model.id) === index
			);
			console.log(uniqueModels);
			return uniqueModels;
		}
	} catch {
		return [];
	}
}
