import React, { useEffect, useMemo, useState } from "react";
import { baseConfig } from "../config";
import { useTranslations } from "use-intl";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import useSettingStore from "@/stores/setting";

const SettingTab = () => {
	const t = useTranslations("settings");
	const pathname = usePathname();
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState("about");
	const { setLastSettingPage } = useSettingStore();

	const config = useMemo(() => {
		return baseConfig.map((item) => ({
			...item,
			title: t(`${item.anchor}.title`),
		}));
	}, []);

	const handleNavigation = (anchor: string) => {
		setCurrentPage(anchor);
		router.push(`/core/setting/${anchor}`);
		// 记录最后访问的设置页面
		setLastSettingPage(anchor);
	};

	useEffect(() => {
		// 从当前URL路径中提取当前页面
		const pageName = pathname.split("/").pop();
		if (pathname === currentPage) return;
		if (pageName && pageName !== "setting") {
			setCurrentPage(pageName);
			// 记录最后访问的设置页面
			setLastSettingPage(pageName);
		}
	}, [pathname, setLastSettingPage]);

	return (
		<nav className="w-56 border-r h-full min-h-screen bg-sidebar p-4">
			<ul>
				{config.map((item) => (
					<li
						key={item.anchor}
						className={cn(
							currentPage === item.anchor
								? "!bg-zinc-800 text-white setting-anchor"
								: "setting-anchor"
						)}
						onClick={() => handleNavigation(item.anchor)}
					>
						{item.icon}
						<span>{item.title}</span>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default SettingTab;
