import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import React from "react";
import MarkToolbar from "./mark/MarkToolbar";
import MarkList from "./mark/MarkList";
import TagManage from "./tag";
import useMarkStore from "@/stores/mark";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const NoteSidebar = () => {
	const t = useTranslations();
	const { trashState, marks } = useMarkStore();

	const handleClearTrash = () => {};

	return (
		<Sidebar collapsible="none" className="border-r ">
			<SidebarHeader className="px-0">
				<MarkToolbar />
				{trashState ? (
					<div className="pb-2 flex pl-2 relative border-b h-6 items-center justify-between">
						<p className="text-xs text-zinc-500">
							{t("record.trash.records", { count: marks.length })}
						</p>
						{marks.length > 0 ? (
							<Button
								className="text-xs text-red-900"
								variant="link"
								onClick={handleClearTrash}
							>
								{t("record.trash.empty")}
							</Button>
						) : null}
					</div>
				) : (
					<TagManage />
				)}
			</SidebarHeader>
			<MarkList />
		</Sidebar>
	);
};

export default NoteSidebar;
