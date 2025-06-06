import React, { useState } from "react";
import SettingType from "../components/SettingType";
import { useTranslations } from "next-intl";
import { FolderOpen } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import FormItem from "../components/FormItem";
import useSettingStore from "@/stores/setting";
import { Button } from "@/components/ui/button";
import { useMount } from "@reactuses/core";
import { open } from "@tauri-apps/plugin-dialog";
import useArticleStore from "@/stores/article";
import { BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs";

const SettingFile = () => {
	const t = useTranslations("settings.file");
	const [defaultPath, setDefaultPath] = useState("");
	const { workspacePath, setWorkspacePath } = useSettingStore();
	const {
		clearCollapsibleList,
		loadFileTree,
		setActiveFilePath,
		setCurrentArticle,
	} = useArticleStore();

	// 选择工作区目录
	const handleSelectWorkspace = async () => {
		try {
			const selected = await open({
				directory: true,
				multiple: false,
				title: t("workspace.select"),
			});

			if (selected) {
				const path = selected as string;
				console.log(path);
				await setWorkspacePath(path);
				await clearCollapsibleList();
				setActiveFilePath("");
				setCurrentArticle("");
				await loadFileTree();
			}
		} catch (error) {
			console.error("选择工作区失败:", error);
		}
	};

	const handleResetWorkspace = async () => {
		try {
			// 确保默认目录存在
			const exists1 = await exists("article", {
				baseDir: BaseDirectory.AppData,
			});
			if (!exists1) {
				await mkdir("article", { baseDir: BaseDirectory.AppData });
			}
			await setWorkspacePath("");
			await clearCollapsibleList();
			setActiveFilePath("");
			setCurrentArticle("");
			await loadFileTree();
		} catch (error) {
			console.error("重置工作区失败:", error);
		}
	};

	// 初始化默认工作区路径
	useMount(async () => {
		const defaultWorkspace = "/article";
		setDefaultPath(defaultWorkspace);
	});

	return (
		<SettingType
			id="file"
			title={t("title")}
			icon={<FolderOpen className=" size-5" />}
		>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>{t("workspace.title")}</CardTitle>
					<CardDescription>{t("workspace.desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<FormItem
						title={t("workspace.current")}
						desc={
							workspacePath
								? t("workspace.custom")
								: t("workspace.default")
						}
					>
						<div className="p-3 border rounded-md bg-muted/50 text-sm break-all">
							{workspacePath || defaultPath}
						</div>
					</FormItem>
				</CardContent>
				<CardFooter className="flex gap-4">
					<Button onClick={handleSelectWorkspace}>
						{t("workspace.select")}
					</Button>
					<Button
						variant="outline"
						disabled={!workspacePath}
						onClick={handleResetWorkspace}
					>
						{t("workspace.reset")}
					</Button>
				</CardFooter>
			</Card>
		</SettingType>
	);
};

export default SettingFile;
