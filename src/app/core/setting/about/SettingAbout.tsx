import React from "react";
import { Bug, DownloadIcon, Github, MessageSquare } from "lucide-react";
import SettingType from "../components/SettingType";
import { useTranslations } from "next-intl";
import SettingRow from "../components/SettingRow";
import Updater from "./Updater";
import AboutItem from "./AboutItem";

interface SettingAboutProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingAbout = ({ id, icon }: SettingAboutProps) => {
	const t = useTranslations("settings.about");
	const items = [
		{
			url: "https://github.com/chenyang-zz/code-gen",
			title: t("items.github.title"),
			icon: <Github className="size-4" />,
			buttonName: t("items.github.buttonName"),
		},
		{
			url: "https://github.com/chenyang-zz/code-gen/releases",
			title: t("items.releases.title"),
			icon: <DownloadIcon className="size-4" />,
			buttonName: t("items.releases.buttonName"),
		},
		{
			url: "https://github.com/chenyang-zz/code-gen/issues",
			title: t("items.issues.title"),
			icon: <Bug className="size-4" />,
			buttonName: t("items.issues.buttonName"),
		},
		{
			url: "https://github.com/chenyang-zz/code-gen/discussions",
			title: t("items.discussions.title"),
			icon: <MessageSquare className="size-4" />,
			buttonName: t("items.discussions.buttonName"),
		},
	];
	return (
		<SettingType id={id} icon={icon} title={t("title")}>
			<SettingRow className="mb-12">
				<Updater />
			</SettingRow>
			{items.map((item) => (
				<AboutItem key={item.url} {...item} />
			))}
		</SettingType>
	);
};

export default SettingAbout;
