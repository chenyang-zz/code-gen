import React from "react";

interface SettingPanelProps {
	children: React.ReactNode;
	title?: string;
	desc?: string;
}

const SettingPanel = ({ children, title, desc }: SettingPanelProps) => {
	return (
		<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-8">
			<div>
				{title && <div className="text-sm mb-2 font-bold">{title}</div>}
				{desc && (
					<p className="text-sm text-muted-foreground mt-2">{desc}</p>
				)}
			</div>
			{children}
		</div>
	);
};

export default SettingPanel;
