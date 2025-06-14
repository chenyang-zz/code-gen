import React from "react";
import SettingType from "../components/SettingType";
import { useTranslations } from "next-intl";
import SettingRow from "../components/SettingRow";
import FormItem from "../components/FormItem";
import { Input } from "@/components/ui/input";
import useSettingStore from "@/stores/setting";
import OpenBroswer from "@/components/OpenBroswer";
import { useMount } from "@reactuses/core";
import { Store } from "@tauri-apps/plugin-store";

interface SettingOcrProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingOcr = ({ id, icon }: SettingOcrProps) => {
	const { tesseractList, setTesseractList } = useSettingStore();
	const t = useTranslations("settings.ocr");

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTesseractList(e.target.value);
	};

	useMount(async () => {
		const store = await Store.load("store.json");
		const list = await store.get<string>("tesseractList");
		if (list) {
			setTesseractList(list);
		} else {
			setTesseractList("");
		}
	});
	return (
		<SettingType id={id} icon={icon} title={t("title")}>
			<SettingRow>
				<FormItem title={t("languagePacks")}>
					<Input value={tesseractList} onChange={changeHandler} />
				</FormItem>
			</SettingRow>
			<SettingRow>
				<span>
					<OpenBroswer
						title={t("checkModels")}
						url="https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016"
					/>
					{t("modelInstruction")}
				</span>
			</SettingRow>
		</SettingType>
	);
};

export default SettingOcr;
