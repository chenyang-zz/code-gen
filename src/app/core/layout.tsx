"use client";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useSettingStore from "@/stores/setting";
import { useEffect } from "react";

export default function CoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { initSettingData } = useSettingStore();
	useEffect(() => {
		initSettingData();
	}, []);
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="flex flex-1  overflow-hidden w-[calc(100vw-48px)] h-screen">
				<main className="flex flex-1  overflow-hidden w-[calc(100vw-48px)] h-screen">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
