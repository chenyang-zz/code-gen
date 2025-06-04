import React from "react";

interface FormItemProps {
	title: string;
	desc?: string;
	children: React.ReactNode;
}
const FormItem = ({ title, desc, children }: FormItemProps) => {
	return (
		<div className="flex flex-col mb-8 w-full">
			<div className="text-sm mb-2 font-bold">{title}</div>
			{children}
			{desc && (
				<p className="text-sm text-muted-foreground mt-2">{desc}</p>
			)}
		</div>
	);
};

export default FormItem;
