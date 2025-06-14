"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar";
import FileSidebar from "./file";

const getDefaultLayout = () => {
	const layout = localStorage.getItem("react-resizable-panels:layout");
	if (layout) {
		return JSON.parse(layout);
	}
	return [25, 75];
};

const ResizebleWrapper = ({ defaultLayout }: { defaultLayout: number[] }) => {
	const { fileSidebarVisible } = useSidebarStore();
	const onLayout = (sizes: number[]) => {
		localStorage.setItem(
			"react-resizable-panels:layout",
			JSON.stringify(sizes)
		);
	};
	return (
		<ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
			<ResizablePanel
				defaultSize={defaultLayout[0]}
				className={cn(
					fileSidebarVisible
						? "max-w-[420px] min-w-[300px]"
						: "!flex-[0]"
				)}
			>
				<FileSidebar />
			</ResizablePanel>
			<ResizableHandle
				className={fileSidebarVisible ? "w-[1px]" : "w-[0]"}
			/>
			<ResizablePanel defaultSize={defaultLayout[1]}></ResizablePanel>
		</ResizablePanelGroup>
	);
};

const ArticlePage = () => {
	const defaultLayout = getDefaultLayout();
	return <ResizebleWrapper defaultLayout={defaultLayout} />;
};

export default dynamic(() => Promise.resolve(ArticlePage), { ssr: false });
