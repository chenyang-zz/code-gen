import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import { computedParentPath } from "@/lib/path";
import { cn } from "@/lib/utils";
import useArticleStore, { type DirTree } from "@/stores/article";
import React, { useMemo, useState } from "react";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import { useMount } from "@reactuses/core";

const FileManager = () => {
	const [isDragging, setIsDragging] = useState(false);
	const { fileTree, loadFileTree } = useArticleStore();
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	useMount(() => {
		if (fileTree.length === 0) {
			loadFileTree();
		}
	});
	return (
		<SidebarContent
			className={cn(
				isDragging &&
					"outline-2 outline-black outline-dotted -outline-offset-4"
			)}
		>
			<SidebarGroup className="flex-1 p-0">
				<SidebarGroupContent className="flex-1">
					<SidebarMenu className="h-full">
						<div
							className="min-h-0.5"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
						></div>
						{fileTree.map((item) => (
							<Tree
								key={item.name + item.parent?.name}
								item={item}
							/>
						))}
						<div
							className="flex-1 min-h-1"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
						></div>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
};

const Tree = ({ item }: { item: DirTree }) => {
	const { collapsibleList, setCollapsibleList, loadCollapsibleFiles } =
		useArticleStore();
	const path = useMemo(() => {
		return computedParentPath(item);
	}, [item]);

	const handleCollapse = () => {};

	return item.isFile ? (
		<FileItem />
	) : (
		<SidebarMenuItem>
			<Collapsible
				onOpenChange={handleCollapse}
				className=" group/collapsible [&[data-state=open]>button>.file-manange-item>svg:first-child]:rotate-90"
				open={collapsibleList.includes(path)}
			>
				<FolderItem item={item} />
				<CollapsibleContent className="pl-1">
					<SidebarMenuSub>
						{item.children?.map((subItem) => (
							<Tree key={subItem.name} item={subItem} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
};

export default FileManager;
