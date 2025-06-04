"use client";
import SettingTab from "./components/SettingTab";

export default function SettingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-1">
			<SettingTab />
			<div className="flex-1 p-8 overflow-y-auto h-screen">
				{children}
			</div>
		</div>
	);
}
