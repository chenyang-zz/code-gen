import { Store } from "@tauri-apps/plugin-store";
import { fetch, Proxy } from "@tauri-apps/plugin-http";
import type { OctokitResponse, RepoNames } from "./github.types";
import { toast } from "sonner";
import { GiteeError } from "./gitee.types";

/**
 * Base64 解码
 */
export function decodeBase64ToString(str: string) {
	return decodeURIComponent(
		atob(str)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);
}

/**
 * 获取文件
 */
export async function getFiles({
	path,
	repo,
}: {
	path: string;
	repo: RepoNames.sync;
}) {
	const store = await Store.load("store.json");
	const accessToken = await store.get<string>("giteeAccessToken");
	if (!accessToken) return;

	const giteeUsername = await store.get<string>("giteeUsername");
	path = path.replace(/\s/g, "_");

	// 获取代理设置
	const proxyUrl = await store.get<string>("proxy");
	const proxy: Proxy | undefined = proxyUrl
		? {
				all: proxyUrl,
		  }
		: undefined;

	try {
		let access_token_param = ``;

		if (path.includes("?ref=")) {
			access_token_param = `&access_token=${accessToken}`;
		} else {
			access_token_param = `?access_token=${accessToken}`;
		}

		const url = `https://gitee.com/api/v5/repos/${giteeUsername}/${repo}/contents/${path}${access_token_param}`;

		const requestOptions = {
			method: "GET",
			proxy,
		};

		const response = await fetch(url, requestOptions);
		if (response.status >= 200 && response.status < 300) {
			const data = await response.json();
			return data;
		}
		return null;
	} catch (error) {
		if ((error as GiteeError).status !== 404) {
			toast.error("查询失败", {
				description: (error as GiteeError).message,
			});
		}
		return null;
	}
}

/**
 * 获取 Gitee 用户信息
 */
export async function getUserInfo() {
	const store = await Store.load("store.json");
	const accessToken = await store.get<string>("giteeAccessToken");
	if (!accessToken) return;

	// 获取代理设置
	const proxyUrl = await store.get<string>("proxy");
	const proxy: Proxy | undefined = proxyUrl
		? {
				all: proxyUrl,
		  }
		: undefined;

	try {
		// 设置请求参数
		const params = new URLSearchParams();
		params.append("access_token", accessToken);

		const requestOptions = {
			methed: "GET",
			proxy,
		};

		const url = `https://gitee.com/api/v5/user?${params.toString()}`;

		const response = await fetch(url, requestOptions);
		if (response.status >= 200 && response.status < 300) {
			const data = await response.json();
			return { data } as OctokitResponse<any>;
		}

		throw new Error("获取用户信息失败");
	} catch (error) {
		toast.error("获取用户信息失败", {
			description: (error as GiteeError).message,
		});
		return null;
	}
}

/**
 * 检查 Gitee 仓库
 */
export async function checkSyncRepoState(name: string) {
	const store = await Store.load("store.json");
	const accessToken = await store.get<string>("giteeAccessToken");
	if (!accessToken) return;

	const giteeUsername = await store.get<string>("giteeUsername");
	if (!giteeUsername) return;

	// 获取代理设置
	const proxyUrl = await store.get<string>("proxy");
	const proxy: Proxy | undefined = proxyUrl
		? {
				all: proxyUrl,
		  }
		: undefined;

	// 设置请求参数
	const params = new URLSearchParams();
	params.append("access_token", accessToken);

	const requestOptions = {
		method: "GET",
		proxy,
	};

	const url = `https://gitee.com/api/v5/repos/${giteeUsername}/${name}?${params.toString()}`;

	const response = await fetch(url, requestOptions);
	if (response.status >= 200 && response.status < 300) {
		const data = await response.json();
		return data;
	}

	return null;
}

export async function createSyncRepo(name: string, isPrivate?: boolean) {
	const store = await Store.load("store.json");
	const accessToken = await store.get<string>("giteeAccessToken");
	if (!accessToken) return null;

	// 获取代理设置
	const proxyUrl = await store.get<string>("proxy");
	const proxy: Proxy | undefined = proxyUrl
		? {
				all: proxyUrl,
		  }
		: undefined;

	try {
		// 设置请求头
		const headers = new Headers();
		headers.append("Content-Type", "application/json");

		const requestOptions = {
			method: "POST",
			headers,
			body: JSON.stringify({
				access_token: accessToken,
				name,
				auto_init: false,
				description: "This is a CodeGen sync repository.",
				private: isPrivate,
			}),
			proxy,
		};

		const url = `https://gitee.com/api/v5/user/repos`;
		const response = await fetch(url, requestOptions);

		if (response.status >= 200 && response.status < 300) {
			const data = await response.json();
			return data;
		}

		const errorData = await response.json();
		throw {
			status: response.status,
			message: errorData.message || "创建仓库失败",
		};
	} catch (error) {
		toast.error("创建仓库失败", {
			description: (error as GiteeError).message,
		});
		return null;
	}
}
