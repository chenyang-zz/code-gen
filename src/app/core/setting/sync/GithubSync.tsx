import React from "react";
import SettingRow from "../components/SettingRow";
import FormItem from "../components/FormItem";
import { useTranslations } from "next-intl";
import OpenBroswer from "@/components/OpenBroswer";
import { Input } from "@/components/ui/input";
import useSettingStore from "@/stores/setting";

const GithubSync = () => {
	const t = useTranslations("settings.sync");
	const { setAccessToken, accessToken } = useSettingStore();

	const tokenChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {};
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
		</>
	);
};

export default GithubSync;
