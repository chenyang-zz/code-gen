import React from "react";
import SettingRow from "../components/SettingRow";
import FormItem from "../components/FormItem";
import { useTranslations } from "next-intl";
import OpenBroswer from "@/components/OpenBroswer";
import { Input } from "@/components/ui/input";
import useSettingStore from "@/stores/setting";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useSyncStore, { SyncStateEnum } from "@/stores/sync";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Store } from "@tauri-apps/plugin-store";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMount } from "@reactuses/core";

dayjs.extend(relativeTime);

const GithubSync = () => {
	const t = useTranslations("settings.sync");
	const {
		setAccessToken,
		accessToken,
		autoSync,
		setAutoSync,
		useImageRepo,
		setUseImageRepo,
		jsdelivr,
		setJsdelivr,
		primaryBackupMethod,
		setPrimaryBackupMethod,
	} = useSettingStore();
	const {
		syncRepoInfo,
		syncRepoState,
		imageRepoState,
		imageRepoInfo,
		setImageRepoInfo,
		setSyncRepoInfo,
		setSyncRepoState,
		setImageRepoState,
	} = useSyncStore();

	const tokenChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		if (value === "") {
			setSyncRepoState(SyncStateEnum.fail);
			setImageRepoState(SyncStateEnum.fail);
			setImageRepoInfo(undefined);
			setSyncRepoInfo(undefined);
		} else {
			setSyncRepoState(SyncStateEnum.checking);
			setImageRepoState(SyncStateEnum.checking);
		}

		setAccessToken(value);

		// 理论上存在失败的可能
		const store = await Store.load("store.json");
		await store.set("accessToken", value);
	};

	useMount(async () => {
		const store = await Store.load("store.json");
		const token = await store.get<string>("accessToken");
		if (token) {
			setAccessToken(token);
		} else {
			setAccessToken("");
		}
	});

	return (
		<>
			<SettingRow>
				<FormItem title="Github Access Token" desc={t("newTokenDesc")}>
					<OpenBroswer
						url="https://github.com/settings/tokens/new"
						title={t("newToken")}
						className="mb-2"
					/>
					<Input value={accessToken} onChange={tokenChangeHandler} />
				</FormItem>
			</SettingRow>
			<SettingRow>
				<FormItem title={t("repoStatus")}>
					<div className="grid grid-cols-2 gap-4">
						<Card>
							<CardHeader
								className={cn(syncRepoInfo && "border-b")}
							>
								<CardTitle className="flex justify-between items-center">
									<span>
										{t("syncRepo")} (
										{syncRepoInfo?.private
											? t("private")
											: t("public")}
										)
									</span>
									<Badge
										className={cn(
											syncRepoState ===
												SyncStateEnum.success
												? "bg-green-800"
												: "bg-red-800"
										)}
									>
										{syncRepoState}
									</Badge>
								</CardTitle>
								<CardDescription>
									{t("syncRepoDesc")}
								</CardDescription>
							</CardHeader>
							{syncRepoInfo && (
								<CardContent>
									<h3 className="text-xl font-bold mt-4 mb-2">
										<OpenBroswer
											title={
												syncRepoInfo?.full_name ?? ""
											}
											url={syncRepoInfo?.html_url ?? ""}
										/>
									</h3>
									<CardDescription className="flex">
										<p className="text-zinc-500 leading-6">
											{t("createdAt", {
												time: dayjs(
													syncRepoInfo?.created_at
												).fromNow(),
											})}
											，
										</p>
										<p className="text-zinc-500 leading-6">
											{t("updatedAt", {
												time: dayjs(
													syncRepoInfo?.updated_at
												).fromNow(),
											})}
										</p>
									</CardDescription>
								</CardContent>
							)}
						</Card>
						<Card>
							<CardHeader
								className={cn(imageRepoInfo && "border-b")}
							>
								<CardTitle className="flex justify-between items-center">
									<span>
										{t("imageRepo")} (
										{imageRepoInfo?.private
											? t("private")
											: t("public")}
										)
									</span>
									<Badge
										className={cn(
											imageRepoState ===
												SyncStateEnum.success
												? "bg-green-800"
												: "bg-red-800"
										)}
									>
										{imageRepoState}
									</Badge>
								</CardTitle>
								<CardDescription>
									{t("imageRepoDesc")}
								</CardDescription>
							</CardHeader>
							{imageRepoInfo && (
								<CardContent>
									<h3 className="text-xl font-bold mt-4 mb-2">
										<OpenBroswer
											title={
												imageRepoInfo?.full_name ?? ""
											}
											url={imageRepoInfo?.html_url ?? ""}
										/>
									</h3>
									<CardDescription className="flex">
										<p className="text-zinc-500 leading-6">
											{t("createdAt", {
												time: dayjs(
													imageRepoInfo?.created_at
												).fromNow(),
											})}
											，
										</p>
										<p className="text-zinc-500 leading-6">
											{t("updatedAt", {
												time: dayjs(
													imageRepoInfo?.updated_at
												).fromNow(),
											})}
										</p>
									</CardDescription>
								</CardContent>
							)}
						</Card>
					</div>
				</FormItem>
			</SettingRow>
			{syncRepoInfo && (
				<>
					<SettingPanel
						title="自动同步"
						desc="选择编辑器在输入停止后自动同步的时间间隔"
					>
						<Select
							value={autoSync}
							onValueChange={setAutoSync}
							disabled={
								!accessToken ||
								syncRepoState !== SyncStateEnum.success
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
			{imageRepoInfo && (
				<>
					<SettingPanel
						title={t("imageRepoSetting")}
						desc={t("imageRepoSettingDesc")}
					>
						<Switch
							checked={useImageRepo}
							onCheckedChange={setUseImageRepo}
							disabled={
								!accessToken ||
								imageRepoState != SyncStateEnum.success
							}
						/>
					</SettingPanel>
					<SettingPanel
						title={t("jsdelivrSetting")}
						desc={t("jsdelivrSettingDesc")}
					>
						<Switch
							checked={jsdelivr}
							onCheckedChange={setJsdelivr}
							disabled={
								!accessToken ||
								imageRepoState !== SyncStateEnum.success
							}
						/>
					</SettingPanel>
				</>
			)}
			<SettingRow className="mb-4">
				{primaryBackupMethod === "github" ? (
					<Button disabled variant="outline">
						{t("isPrimaryBackup", { type: "Github" })}
					</Button>
				) : (
					<Button
						variant="outline"
						disabled={
							!accessToken ||
							syncRepoState !== SyncStateEnum.success
						}
						onClick={() => setPrimaryBackupMethod("github")}
					>
						{t("setPrimaryBackup")}
					</Button>
				)}
			</SettingRow>
		</>
	);
};

export default GithubSync;
