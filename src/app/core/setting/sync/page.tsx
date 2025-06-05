"use client";

import React from "react";
import SettingType from "../components/SettingType";
import { FileUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GithubSync from "./GithubSync";
import GiteeSync from "./GiteeSync";
import WebdavSync from "./WebdavSync";

const SyncPage = () => {
	const t = useTranslations("settings.sync");
	return (
		<SettingType
			id="sync"
			icon={<FileUp />}
			title={t("title")}
			desc={t("desc")}
		>
			<Tabs defaultValue="Github">
				<TabsList className="grid grid-cols-3 w-[600px] mb-8">
					<TabsTrigger value="Github">Github</TabsTrigger>
					<TabsTrigger value="Gitee">Gitee</TabsTrigger>
					<TabsTrigger value="Webdav">Webdav</TabsTrigger>
				</TabsList>
				<TabsContent value="Github">
					<GithubSync />
				</TabsContent>
				<TabsContent value="Gitee">
					<GiteeSync />
				</TabsContent>
				<TabsContent value="Webdav">
					<WebdavSync />
				</TabsContent>
			</Tabs>
		</SettingType>
	);
};

export default SyncPage;
