import { Button } from "@/components/ui/button";
import SettingRow from "../components/SettingRow";
import { open } from "@tauri-apps/plugin-shell";

interface AboutItemProps {
	url: string;
	title: string;
	icon?: React.ReactNode;
	buttonName?: string;
}

const AboutItem = ({ url, title, icon, buttonName }: AboutItemProps) => {
	const openInBrowser = () => {
		open(url);
	};
	return (
		<SettingRow border className="flex items-center justify-between w-full">
			<div className="flex items-center gap-2">
				{icon}
				<span>{title}</span>
			</div>
			<Button variant="outline" onClick={openInBrowser}>
				{buttonName}
			</Button>
		</SettingRow>
	);
};

export default AboutItem;
