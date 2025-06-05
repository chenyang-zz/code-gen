import useSettingStore from "@/stores/setting";
import { useTranslations } from "next-intl";
import React from "react";
import SettingType from "../components/SettingType";
import SettingRow from "../components/SettingRow";
import FormItem from "../components/FormItem";
import ModelSelect from "./ModelSelect";

interface SettingProps {
	id: string;
	icon?: React.ReactNode;
}

const Setting = ({ id, icon }: SettingProps) => {
	const t = useTranslations("settings.defaultModel");
	const { model, aiType } = useSettingStore();
	const options = [
		{
			title: t("options.markDesc.title"),
			desc: t("options.markDesc.desc"),
			modelKey: "markDesc",
		},
		{
			title: t("options.placeholder.title"),
			desc: t("options.placeholder.desc"),
			modelKey: "placeholder",
		},
		{
			title: t("options.translate.title"),
			desc: t("options.translate.desc"),
			modelKey: "translate",
		},
	];
	return (
		<SettingType id={id} icon={icon} title={t("title")} desc={t("desc")}>
			<SettingRow>
				<FormItem title={t("mainModel")}>
					<p>
						{model}({aiType})
					</p>
				</FormItem>
			</SettingRow>
			{options.map((item) => (
				<SettingRow key={item.modelKey}>
					<FormItem title={item.title} desc={item.desc}>
						<ModelSelect modelKey={item.modelKey} />
					</FormItem>
				</SettingRow>
			))}
		</SettingType>
	);
};

export default Setting;
