import { cn } from "@/lib/utils";
import React from "react";

interface SettingRowProps {
	border?: boolean;
	children: React.ReactNode;
	className?: string;
}

const SettingRow = ({
	border = false,
	children,
	className,
}: SettingRowProps) => {
	return (
		<div
			className={cn(
				border && "border-b py-4",
				"flex justify-between items-center text-sm",
				className
			)}
		>
			{children}
		</div>
	);
};

export default SettingRow;
