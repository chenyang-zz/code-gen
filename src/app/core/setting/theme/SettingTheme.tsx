import React from "react";
import SettingType from "../components/SettingType";
import { useTranslations } from "next-intl";
import SettingRow from "../components/SettingRow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useSettingStore from "@/stores/setting";
import { useMount } from "@reactuses/core";
import { Store } from "@tauri-apps/plugin-store";
import { useTheme } from "next-themes";

interface SettingThemeProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingTheme = ({ id, icon }: SettingThemeProps) => {
	const t = useTranslations("settings.theme");

	return (
		<SettingType id={id} icon={icon} title={t("title")}>
			<SettingRow border>
				<span>{t("appTheme") || "应用配色"}</span>
				<AppThemeSelect />
			</SettingRow>
			<SettingRow border>
				<span>{t("previewTheme")}</span>
				<PreviewThemeSelect />
			</SettingRow>
			<SettingRow border>
				<span>{t("codeTheme")}</span>
				<CodeThemeSelect />
			</SettingRow>
		</SettingType>
	);
};

export const AppThemeSelect = () => {
	const t = useTranslations("settings.theme");
	const { theme, setTheme } = useTheme();
	const themes = [
		{ value: "light", label: "亮色" },
		{ value: "dark", label: "暗色" },
		{ value: "system", label: "跟随系统" },
	];

	return (
		<Select value={theme} onValueChange={setTheme}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={t("selectTheme")} />
			</SelectTrigger>
			<SelectContent>
				{themes.map((theme) => (
					<SelectItem key={theme.value} value={theme.value}>
						{theme.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export const PreviewThemeSelect = () => {
	const t = useTranslations("settings.theme");
	const { previewTheme, setPreviewTheme } = useSettingStore();
	const themes = ["github", "vuepress", "mk-cute", "smart-blue", "cyanosis"];

	useMount(async () => {
		const store = await Store.load("store.json");
		const theme = await store.get<string>("previewTheme");
		if (theme) {
			setPreviewTheme(theme);
		} else {
			setPreviewTheme(themes[0]);
		}
	});
	return (
		<Select value={previewTheme} onValueChange={setPreviewTheme}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={t("selectTheme")} />
			</SelectTrigger>
			<SelectContent>
				{themes.map((theme) => (
					<SelectItem key={theme} value={theme}>
						{theme}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export const CodeThemeSelect = () => {
	const t = useTranslations("settings.theme");
	const { codeTheme, setCodeTheme } = useSettingStore();
	const themes = [
		"github",
		"github-dark",
		"material-darker",
		"material-palenight",
		"one-dark",
	];

	useMount(async () => {
		const store = await Store.load("store.json");
		const theme = await store.get<string>("codeTheme");
		if (theme) {
			setCodeTheme(theme);
		} else {
			setCodeTheme(themes[0]);
		}
	});

	return (
		<Select value={codeTheme} onValueChange={setCodeTheme}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={t("selectTheme")} />
			</SelectTrigger>
			<SelectContent>
				{themes.map((theme) => (
					<SelectItem key={theme} value={theme}>
						{theme}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default SettingTheme;
