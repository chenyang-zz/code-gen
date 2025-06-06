import useSettingStore from "@/stores/setting";
import useSyncStore, { SyncStateEnum } from "@/stores/sync";
import { Store } from "@tauri-apps/plugin-store";
import { useTranslations } from "next-intl";
import React, { type ChangeEvent } from "react";
import SettingRow from "../components/SettingRow";
import FormItem from "../components/FormItem";
import OpenBroswer from "@/components/OpenBroswer";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import SettingPanel from "../components/SettingPanel";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMount } from "@reactuses/core";

const GiteeSync = () => {
	const t = useTranslations("settings.sync");
	const {
		giteeAccessToken,
		setGiteeAccessToken,
		giteeAutoSync,
		setGiteeAutoSync,
		primaryBackupMethod,
		setPrimaryBackupMethod,
	} = useSettingStore();
	const {
		giteeSyncRepoState,
		setGiteeSyncRepoState,
		giteeSyncRepoInfo,
		setGiteeSyncRepoInfo,
	} = useSyncStore();

	const tokenChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "") {
			setGiteeSyncRepoState(SyncStateEnum.fail);
			setGiteeSyncRepoInfo(undefined);
		} else {
			// 有新的令牌值，但还未验证时先显示检测中状态
			setGiteeSyncRepoState(SyncStateEnum.checking);
		}
		setGiteeAccessToken(value);
		const store = await Store.load("store.json");
		await store.set("giteeAccessToken", value);
	};

	useMount(async () => {
		const store = await Store.load("store.json");
		const token = await store.get<string>("giteeAccessToken");
		if (token) {
			setGiteeAccessToken(token);
		} else {
			setGiteeAccessToken("");
		}
	});

	return (
		<>
			<SettingRow>
				<FormItem title="Gitee 私人令牌" desc={t("giteeTokenDesc")}>
					<OpenBroswer
						url="https://gitee.com/profile/personal_access_tokens/new"
						title={t("newToken")}
						className="mb-2"
					/>
					<Input
						value={giteeAccessToken}
						onChange={tokenChangeHandler}
					/>
				</FormItem>
			</SettingRow>
			<SettingRow>
				<FormItem title={t("repoStatus")}>
					<div className="grid grid-cols-2 gap-4">
						<Card>
							<CardHeader
								className={cn(giteeSyncRepoInfo && "border-b")}
							>
								<CardTitle className="flex justify-between items-center">
									<span>
										{t("syncRepo")} (
										{giteeSyncRepoInfo?.private
											? t("private")
											: t("public")}
										)
									</span>
									<Badge
										className={cn(
											giteeSyncRepoState ===
												SyncStateEnum.success
												? "bg-green-800"
												: "bg-red-800"
										)}
									>
										{giteeSyncRepoState}
									</Badge>
								</CardTitle>
								<CardDescription>
									{t("syncRepoDesc")}
								</CardDescription>
							</CardHeader>
							{giteeSyncRepoInfo && (
								<CardContent>
									<h3 className="text-xl font-bold mt-4 mb-2">
										<OpenBroswer
											title={
												giteeSyncRepoInfo?.full_name ??
												""
											}
											url={
												giteeSyncRepoInfo?.html_url ??
												""
											}
										/>
									</h3>
									<CardDescription className="flex">
										<p className="text-zinc-500 leading-6">
											{t("createdAt", {
												time: dayjs(
													giteeSyncRepoInfo?.created_at
												).fromNow(),
											})}
											，
										</p>
										<p className="text-zinc-500 leading-6">
											{t("updatedAt", {
												time: dayjs(
													giteeSyncRepoInfo?.updated_at
												).fromNow(),
											})}
											。
										</p>
									</CardDescription>
								</CardContent>
							)}
						</Card>
					</div>
				</FormItem>
			</SettingRow>
			{giteeSyncRepoInfo && (
				<>
					<SettingPanel
						title={t("autoSync")}
						desc={t("giteeAutoSyncDesc")}
					>
						<Select
							value={giteeAutoSync}
							onValueChange={setGiteeAutoSync}
							disabled={
								!giteeAccessToken ||
								giteeSyncRepoState !== SyncStateEnum.success
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue
									placeholder={t(
										"autoSyncOptions.placeholder"
									)}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="disabled">
									{t("autoSyncOptions.disabled")}
								</SelectItem>
								<SelectItem value="10">
									{t("autoSyncOptions.10s")}
								</SelectItem>
								<SelectItem value="30">
									{t("autoSyncOptions.30s")}
								</SelectItem>
								<SelectItem value="60">
									{t("autoSyncOptions.1m")}
								</SelectItem>
								<SelectItem value="300">
									{t("autoSyncOptions.5m")}
								</SelectItem>
								<SelectItem value="1800">
									{t("autoSyncOptions.30m")}
								</SelectItem>
							</SelectContent>
						</Select>
					</SettingPanel>
				</>
			)}
			<SettingRow>
				{primaryBackupMethod === "gitee" ? (
					<Button disabled variant="outline">
						{t("isPrimaryBackup", { type: "Gitee" })}
					</Button>
				) : (
					<Button
						variant="outline"
						onClick={() => setPrimaryBackupMethod("gitee")}
						disabled={
							!giteeAccessToken ||
							giteeSyncRepoState !== SyncStateEnum.success
						}
					>
						{t("setPrimaryBackup")}
					</Button>
				)}
			</SettingRow>
		</>
	);
};

export default GiteeSync;
