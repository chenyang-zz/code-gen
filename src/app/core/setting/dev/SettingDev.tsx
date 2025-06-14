import { useTranslations } from "next-intl";
import SettingType from "../components/SettingType";
import SettingRow from "../components/SettingRow";
import { Input } from "@/components/ui/input";
import useSettingStore from "@/stores/setting";
import { Button } from "@/components/ui/button";
import { confirm, message } from "@tauri-apps/plugin-dialog";
import { Store } from "@tauri-apps/plugin-store";
import { BaseDirectory, exists, remove } from "@tauri-apps/plugin-fs";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { toast } from "sonner";
import SettingConfig from "./SettingConfig";

interface SettingDevProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingDev = ({ id, icon }: SettingDevProps) => {
	const t = useTranslations("settings.dev");
	const { proxy, setProxy } = useSettingStore();

	const handleClearData = async () => {
		const res = await confirm(t("clearDataConfirm"), {
			title: t("clearData"),
			kind: "warning",
		});
		if (res) {
			const store = await Store.load("store.json");
			await store.clear();
			const files = ["store.json", "note.db"];
			for (const file of files) {
				const isFileExists = await exists(file, {
					baseDir: BaseDirectory.AppData,
				});
				if (isFileExists) {
					await remove(file, { baseDir: BaseDirectory.AppData });
				}
			}
			message("数据已清理，请重启应用", {
				title: "重启应用",
				kind: "info",
			}).then(async () => {
				await getCurrentWindow().close();
			});
		}
	};

	const handleClearFile = async () => {
		const res = await confirm("确定清理文件吗？清理后将无法恢复！", {
			title: "清理文件",
			kind: "warning",
		});
		if (res) {
			const folders = ["screenshot", "article", "clipboard", "image"];
			for (const folder of folders) {
				const isFolderExists = await exists(folder, {
					baseDir: BaseDirectory.AppData,
				});
				if (isFolderExists) {
					await remove(folder, {
						baseDir: BaseDirectory.AppData,
						recursive: true,
					});
				}
			}
			toast("文件已清理");
		}
	};

	return (
		<SettingType id={id} icon={icon} title={t("title")}>
			<SettingRow border className="gap-4">
				<span>{t("proxy")}</span>
				<Input
					className="max-w-[400px]"
					placeholder={t("proxyPlaceholder")}
					value={proxy}
					onChange={(e) => setProxy(e.target.value)}
				/>
			</SettingRow>
			<SettingRow border>
				<span>
					清理数据信息，包括系统配置信息、数据库（包含记录）。
				</span>
				<Button variant="destructive" onClick={handleClearData}>
					清理
				</Button>
			</SettingRow>
			<SettingRow border>
				<span>清理文件，包括图片、文章。</span>
				<Button variant="destructive" onClick={handleClearFile}>
					清理
				</Button>
			</SettingRow>
			<SettingConfig />
		</SettingType>
	);
};

export default SettingDev;
