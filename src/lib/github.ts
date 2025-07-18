import { Store } from "@tauri-apps/plugin-store";
import { fetch, Proxy } from "@tauri-apps/plugin-http";
import type {
	GithubError,
	GithubRepoInfo,
	OctokitResponse,
	RepoNames,
} from "./github.types";
import { toast } from "sonner";

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
	repo: RepoNames;
}) {
	const store = await Store.load("store.json");
	const accessToken = await store.get("accessToken");
	if (!accessToken) return;

	const githubUsername = await store.get("githubUsername");
	path = path.replace(/\s/g, "_");

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
		headers.append("Authorization", `Bearer ${accessToken}`);
		headers.append("Accept", "application/vnd.github+json");
		headers.append("X-GitHub-Api-Version", "2022-11-28");
		headers.append("If-None-Match", "");

		const requestOptions = {
			method: "GET",
			headers,
			proxy,
		};

		const url = `https://api.github.com/repos/${githubUsername}/${repo}/contents/${path}`;

		const response = await fetch(url, requestOptions);
		if (response.status >= 200 && response.status < 300) {
			const data = await response.json();
			return data;
		}
		return null;
	} catch (error) {
		if ((error as GithubError).status !== 404) {
			toast.error("查询失败", {
				description: (error as GithubError).message,
			});
		}
		return null;
	}
}

/**
 * 获取 Github 用户信息
 */
export async function getUserInfo() {
	const store = await Store.load("store.json");
	const accessToken = await store.get<string>("accessToken");
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
		headers.append("Authorization", `Bearer ${accessToken}`);
		headers.append("Accept", "application/vnd.github+json");
		headers.append("X-GitHub-Api-Version", "2022-11-28");

		const requestOptions = {
			method: "GET",
			headers,
			proxy,
		};

		const url = "https://api.github.com/user";
		const response = await fetch(url, requestOptions);

		if (response.status >= 200 && response.status < 300) {
			const data = await response.json();
			return { data } as OctokitResponse<any>;
		}

		throw new Error("获取用户信息失败");
	} catch (error) {
		toast.error("获取用户信息失败", {
			description: (error as GithubError).message,
		});
		return null;
	}
}

/**
 * 检查 Github 仓库
 */
export async function checkSyncRepoState(name: string) {
	const store = await Store.load("store.json");
	const githubUsername = await store.get("githubUsername");
	if (!githubUsername) return null;
	const accessToken = await store.get("accessToken");
	if (!accessToken) return null;

	// 获取代理设置
	const proxyUrl = await store.get<string>("proxy");
	const proxy: Proxy | undefined = proxyUrl
		? {
				all: proxyUrl,
		  }
		: undefined;

	// 设置请求头
	const headers = new Headers();
	headers.append("Authorization", `Bearer ${accessToken}`);
	headers.append("Accept", "application/vnd.github+json");
	headers.append("X-GitHub-Api-Version", "2022-11-28");

	const requestOptions = {
		method: "GET",
		headers,
		proxy,
	};

	const url = `https://api.github.com/repos/${githubUsername}/${name}`;
	const response = await fetch(url, requestOptions);

	if (response.status >= 200 && response.status < 300) {
		const data = await response.json();
		return data;
	}

	return null;
}

/**
 * 创建 Github 仓库
 */
export async function createSyncRepo(name: string, isPrivate?: boolean) {
	const store = await Store.load("store.json");
	const accessToken = await store.get("accessToken");
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
		headers.append("Authorization", `Bearer ${accessToken}`);
		headers.append("Accept", "application/vnd.github+json");
		headers.append("X-GitHub-Api-Version", "2022-11-28");
		headers.append("Content-Type", "application/json");

		const requestOptions = {
			method: "POST",
			headers,
			body: JSON.stringify({
				name,
				description: "This is a CodeGen sync repository.",
				private: isPrivate,
			}),
			proxy,
		};

		const url = "https://api.github.com/user/repos";
		const response = await fetch(url, requestOptions);

		if (response.status >= 200 && response.status < 300) {
			const data = (await response.json()) as GithubRepoInfo;
			return data;
		}

		const errorData = await response.json();
		throw {
			status: response.status,
			message: errorData.message || "创建仓库失败",
		};
	} catch (error) {
		toast.error("创建仓库失败", {
			description: (error as GithubError).message,
		});
		return null;
	}
}
