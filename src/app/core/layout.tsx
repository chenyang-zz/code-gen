"use client";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { initAllDatabases } from "@/db";
import useSettingStore from "@/stores/setting";
import { useMount } from "@reactuses/core";
import { ThemeProvider } from "next-themes";
import dayjs from "dayjs";
import zh from "dayjs/locale/zh-cn";
import en from "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import { useI18n } from "@/hooks/useI18n,";
import { useEffect } from "react";

dayjs.extend(relativeTime);
export default function CoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { currentLocale } = useI18n();
	const { initSettingData } = useSettingStore();

	useMount(() => {
		initSettingData();

		initAllDatabases();
	});

	useEffect(() => {
		switch (currentLocale) {
			case "zh":
				dayjs.locale(zh);
				break;
			case "en":
				dayjs.locale(en);
				break;
			default:
				break;
		}
	}, [currentLocale]);

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
