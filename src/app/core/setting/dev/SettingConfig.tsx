import React from "react";
import SettingRow from "../components/SettingRow";
import { Button } from "@/components/ui/button";
import { HardDriveDownload, HardDriveUpload } from "lucide-react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, copyFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { relaunch } from "@tauri-apps/plugin-process";

const SettingConfig = () => {
	const handleImport = async () => {
		const file = await open({ title: "导入配置文件" });
		if (file) {
			await copyFile(file, "store.json", {
				toPathBaseDir: BaseDirectory.AppData,
			});
			toast("导入成功");
			relaunch();
		}
	};

	const handleExport = async () => {
		const file = await save({
			title: "导出文件配置",
			defaultPath: "store.json",
		});
		if (file) {
			await copyFile("store.json", file, {
				fromPathBaseDir: BaseDirectory.AppData,
			});
			toast("导出成功");
		}
	};

	return (
		<SettingRow border>
			<span>
				配置文件导入与导出，导入配置文件将覆盖当前配置，并且重启后生效。
			</span>
			<div className="flex gap-2">
				<Button onClick={handleImport}>
					<HardDriveDownload />
					导入
				</Button>
				<Button onClick={handleExport}>
					<HardDriveUpload />
					导出
				</Button>
			</div>
		</SettingRow>
	);
};

export default SettingConfig;
