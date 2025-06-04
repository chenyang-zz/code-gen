import React from "react";

interface SettingTypeProps {
	id: string;
	title: string;
	icon?: React.ReactNode;
	desc?: string;
	children?: React.ReactNode;
}

const SettingType = ({ id, title, icon, desc, children }: SettingTypeProps) => {
	return (
		<div id={id} className="flex flex-col">
			<div className="mb-10">
				<h2 className="text-xl w-full font-bold flex items-center gap-2 mb-2">
					{icon}
					{title}
				</h2>
				{desc && (
					<p className="text-sm text-muted-foreground">{desc}</p>
				)}
			</div>
			{children}
		</div>
	);
};

export default SettingType;
