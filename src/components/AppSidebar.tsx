"use client";
import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import AppStatus from "./AppStatus";
import {
	Highlighter,
	Search,
	SquarePen,
	ImageUp,
	Settings,
	Mic,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Store } from "@tauri-apps/plugin-store";
import { useSidebarStore } from "@/stores/sidebar";

const AppSidebar = () => {
	const t = useTranslations();
	const pathname = usePathname();
	const router = useRouter();
	const { toggleFileSidebar } = useSidebarStore();
	const items = [
		{
			title: t("navigation.record"),
			url: "/core/record",
			icon: Highlighter,
			isActive: true,
		},
		{
			title: t("navigation.write"),
			url: "/core/article",
			icon: SquarePen,
		},
		{
			title: t("navigation.search"),
			url: "/core/search",
			icon: Search,
		},
		{
			title: t("navigation.gallery"),
			url: "/core/image",
			icon: ImageUp,
		},
		{
			title: "面试",
			url: "/core/interview",
			icon: Mic,
		},
	];

	const menuHandler = async (item: (typeof items)[0]) => {
		if (pathname === "/core/article" && item.url === "/core/article") {
			toggleFileSidebar();
		} else {
			router.push(item.url);
		}
		const store = await Store.load("store.json");
		await store.set("currentPage", item.url);
	};
	return (
		<Sidebar
			collapsible="none"
			className="!w-[calc(var(--sidebar-width-icon)+1px)] border-r h-screen"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<AppStatus />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										disabled={item.url === "#"}
										isActive={pathname === item.url}
										tooltip={{
											children: item.title,
											hidden: false,
										}}
									>
										<div
											className="cursor-pointer"
											onClick={() => menuHandler(item)}
										>
											<item.icon />
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenuButton
					asChild
					isActive={pathname === "/core/setting"}
					tooltip={{
						children: t("common.settings"),
						hidden: false,
					}}
				>
					<Link href="/core/setting">
						<div className="flex-center size-8 rounded-lg">
							<Settings className="size-4" />
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
