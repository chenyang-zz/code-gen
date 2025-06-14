"use client";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { initAllDatabases } from "@/db";
import useSettingStore from "@/stores/setting";
import { useMount } from "@reactuses/core";
import { ThemeProvider } from "next-themes";

export default function CoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { initSettingData } = useSettingStore();
	useMount(() => {
		initSettingData();

		initAllDatabases();
	});
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1  overflow-hidden w-[calc(100vw-48px)] h-screen">
					<main className="flex flex-1  overflow-hidden w-[calc(100vw-48px)] h-screen">
						{children}
					</main>
				</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	);
}
