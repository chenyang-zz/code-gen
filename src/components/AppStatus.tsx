import React from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useSyncStore, { SyncStateEnum } from "@/stores/sync";
import useSettingStore from "@/stores/setting";
import { CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateEffect } from "@reactuses/core";
import { getUserInfo, checkSyncRepoState, createSyncRepo } from "@/lib/github";
import { RepoNames, UserInfo } from "@/lib/github.types";
import type { GiteeUserInfo } from "@/lib/gitee.types";
import { open } from "@tauri-apps/plugin-shell";

const AppStatus = () => {
	const {
		primaryBackupMethod,
		accessToken,
		giteeAccessToken,
		setGithubUsername,
		setGiteeUsername,
	} = useSettingStore();
	const {
		userInfo,
		setUserInfo,

		giteeUserInfo,
		setGiteeUserInfo,

		syncRepoState,
		giteeSyncRepoState,
		setImageRepoState,
		setImageRepoInfo,
		setSyncRepoState,
		setSyncRepoInfo,
		setGiteeSyncRepoInfo,
		setGiteeSyncRepoState,
	} = useSyncStore();

	// 获取当前主要备份方式的用户信息
	const handleGetUserInfo = async (method: "github" | "gitee") => {
		try {
			if (accessToken && method === "github") {
				// 获取 GitHub 用户信息
				setImageRepoInfo(undefined);
				setSyncRepoInfo(undefined);
				setImageRepoState(SyncStateEnum.checking);
				setSyncRepoState(SyncStateEnum.checking);
				setUserInfo(undefined);
				const res = await getUserInfo();
				if (res) {
					setUserInfo(res.data as UserInfo);
					setGithubUsername(res.data.login);
				}

				// 检查仓库状态 - GitHub
				await checkGithubRepos();
			} else if (giteeAccessToken && method === "gitee") {
				// 获取 Gitee 用户信息
				setGiteeSyncRepoInfo(undefined);
				setGiteeSyncRepoState(SyncStateEnum.checking);
				setGiteeUserInfo(undefined);
				const res = await import("@/lib/gitee").then((module) =>
					module.getUserInfo()
				);

				if (res) {
					setGiteeUserInfo(res.data as GiteeUserInfo);
					setGiteeUsername(res.data.login);
				}

				// 检查仓库状态 - Gitee
				await checkGiteeRepos();
			} else {
				setUserInfo(undefined);
				setGiteeUserInfo(undefined);
			}
		} catch (err) {
			console.error("Failed to get user info:", err);
		}
	};

	// 检查 GitHub 仓库状态
	const checkGithubRepos = async () => {
		try {
			// 检查图床仓库状态
			const imageRepo = await checkSyncRepoState(RepoNames.image);
			if (imageRepo) {
				setImageRepoInfo(imageRepo);
				setImageRepoState(SyncStateEnum.success);
			} else {
				setImageRepoState(SyncStateEnum.creating);
				const info = await createSyncRepo(RepoNames.image);
				if (info) {
					setImageRepoInfo(info);
					setImageRepoState(SyncStateEnum.success);
				} else {
					setImageRepoState(SyncStateEnum.fail);
				}
			}

			// 检查同步仓库状态
			const syncRepo = await checkSyncRepoState(RepoNames.sync);
			if (syncRepo) {
				setSyncRepoInfo(syncRepo);
				setSyncRepoState(SyncStateEnum.success);
			} else {
				setSyncRepoState(SyncStateEnum.creating);
				const info = await createSyncRepo(RepoNames.sync, true);
				if (info) {
					setSyncRepoInfo(info);
					setSyncRepoState(SyncStateEnum.success);
				} else {
					setSyncRepoState(SyncStateEnum.fail);
				}
			}
		} catch (err) {
			console.error("Failed to check GitHub repos:", err);
			setImageRepoState(SyncStateEnum.fail);
			setSyncRepoState(SyncStateEnum.fail);
		}
	};

	// 检查 Gitee 仓库状态
	const checkGiteeRepos = async () => {
		try {
			const { checkSyncRepoState, createSyncRepo } = await import(
				"@/lib/gitee"
			);

			// 检查同步仓库状态
			const syncRepo = await checkSyncRepoState(RepoNames.sync);
			if (syncRepo) {
				setGiteeSyncRepoInfo(syncRepo);
				setGiteeSyncRepoState(SyncStateEnum.success);
			} else {
				// 仓库不存在，尝试创建
				setGiteeSyncRepoState(SyncStateEnum.creating);
				const info = await createSyncRepo(RepoNames.sync, true);
				if (info) {
					setGiteeSyncRepoInfo(info);
					setGiteeSyncRepoState(SyncStateEnum.success);
				} else {
					setGiteeSyncRepoState(SyncStateEnum.fail);
				}
			}
		} catch (err) {
			console.error("Failed to check Gitee repos:", err);
			setGiteeSyncRepoState(SyncStateEnum.fail);
		}
	};

	const openUserHome = () => {
		if (primaryBackupMethod === "github") {
			if (!userInfo) return;
			open(`https://github.com/${userInfo?.login}`);
		} else if (primaryBackupMethod === "gitee") {
			if (!giteeUserInfo) return;
			open(`https://gitee.com/${giteeUserInfo?.login}`);
		}
	};

	useUpdateEffect(() => {
		if (accessToken) {
			handleGetUserInfo("github");
		}
	}, [accessToken]);

	useUpdateEffect(() => {
		if (giteeAccessToken) {
			handleGetUserInfo("gitee");
		}
	}, [giteeAccessToken]);

	return (
		<SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
			<div
				className=" relative flex items-center gap-2 cursor-pointer"
				onClick={openUserHome}
			>
				<Avatar className=" size-8 rounded">
					{primaryBackupMethod === "github" ? (
						<>
							<AvatarImage src={userInfo?.avatar_url} />
							<AvatarFallback className="rounded bg-primary text-primary-foreground">
								{userInfo ? (
									userInfo.login.slice(0, 1)
								) : (
									<CircleUserRound className="size-5" />
								)}
							</AvatarFallback>
						</>
					) : primaryBackupMethod === "gitee" ? (
						<>
							<AvatarImage src={giteeUserInfo?.avatar_url} />
							<AvatarFallback className="rounded bg-primary text-primary-foreground">
								{giteeUserInfo ? (
									giteeUserInfo.login.slice(0, 1)
								) : (
									<CircleUserRound className="size-5" />
								)}
							</AvatarFallback>
						</>
					) : (
						<AvatarFallback></AvatarFallback>
					)}
				</Avatar>
				{primaryBackupMethod === "github" ? (
					<div
						className={cn(
							" absolute right-0.5 bottom-0.5 rounded-full size-2",
							syncRepoState === SyncStateEnum.fail
								? "bg-red-700"
								: syncRepoState === SyncStateEnum.checking
								? "bg-orange-400"
								: ""
						)}
					></div>
				) : primaryBackupMethod === "gitee" ? (
					<div
						className={cn(
							"absolute right-0.5 bottom-0.5 rounded-full size-2",
							giteeSyncRepoState === SyncStateEnum.fail
								? "bg-red-700"
								: giteeSyncRepoState === SyncStateEnum.checking
								? "bg-orange-400"
								: ""
						)}
					></div>
				) : null}
			</div>
		</SidebarMenuButton>
	);
};

export default AppStatus;
