import { cn } from "@/lib/utils";
import { open } from "@tauri-apps/plugin-shell";
import React from "react";
import Link from "next/link";

interface OpenBroswerProps {
	title: string;
	url: string;
	className?: string;
}

const OpenBroswer = ({ title, url, className }: OpenBroswerProps) => {
	return (
		<Link
			className={cn("underline hover:text-zinc-900", className)}
			href="#"
			onClick={() => open(url)}
		>
			{title}
		</Link>
	);
};

export default OpenBroswer;
