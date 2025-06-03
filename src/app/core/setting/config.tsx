import {
	BotMessageSquare,
	LayoutTemplate,
	Command,
	FileUp,
	Palette,
	ScanText,
	Store,
	UserRoundCog,
	Drama,
	FolderOpen,
	Package,
} from "lucide-react";

export const baseConfig = [
	{
		icon: <Store />,
		anchor: "about",
	},
	{
		icon: <BotMessageSquare />,
		anchor: "ai",
	},
	{
		icon: <Package />,
		anchor: "defaultModel",
	},
	{
		icon: <Drama />,
		anchor: "prompt",
	},
	{
		icon: <LayoutTemplate />,
		anchor: "template",
	},
	{
		icon: <FileUp />,
		anchor: "sync",
	},
	{
		icon: <FolderOpen />,
		anchor: "file",
	},
	{
		icon: <ScanText />,
		anchor: "ocr",
	},
	{
		icon: <Command />,
		anchor: "shortcut",
	},
	{
		icon: <Palette />,
		anchor: "theme",
	},
	{
		icon: <UserRoundCog />,
		anchor: "dev",
	},
];

export interface AiConfig {
	key: string;
	title: string;
	type: "built-in" | "custom";
	temperature: number;
	topP: number;
	apiKey?: string;
	model?: string;
	baseURL?: string;
}
