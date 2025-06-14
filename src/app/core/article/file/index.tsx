import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import React from "react";
import FileToolbar from "./FileToolbar";
import FileManager from "./FileManager";

const FileSidebar = () => {
	return (
		<Sidebar collapsible="none" className="w-full h-screen">
			<SidebarHeader className="p-0">
				<FileToolbar />
			</SidebarHeader>
			<FileManager />
		</Sidebar>
	);
};

export default FileSidebar;
