import { CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { type DirTree } from "@/stores/article";
import useClipboardStore from "@/stores/clipboard";
import { ChevronRight, Folder, FolderDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

const FolderItem = ({ item }: { item: DirTree }) => {
	const t = useTranslations("article.file");
	const [isDragging, setIsDragging] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { clipboardItem } = useClipboardStore();

	const inputRef = useRef<HTMLInputElement>(null);

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
	const newFileHandler = () => {};
	const newFolderHandler = () => {};
	const handleShowFileManager = () => {};
	const handleCutFolder = () => {};
	const handleCopyFolder = () => {};
	const handlePasteInFolder = () => {};
	const handleStartRename = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};
	const handleDeleteFolder = () => {};

	return (
		<CollapsibleTrigger className="w-full select-none">
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<div
						className={cn(
							isDragging && "file-on-drop",
							"group file-manage-item flex select-none"
						)}
					>
						<ChevronRight className="transition-transform size-4 ml-1 bg-sidebar group-hover:bg-transparent" />
						{isEditing ? (
							<>
								{item.isLocale ? (
									<Folder className="size-4" />
								) : (
									<FolderDown className="size-4" />
								)}
							</>
						) : (
							<div
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								className={cn(
									!item.isLocale && "opacity-50",
									"flex gap-1 items-center flex-1 select-none"
								)}
							>
								<div className="flex flex-1 gap-1 select-none relative">
									<div className="relative"></div>
									<span className="text-xs line-clamp-1">
										{item.name}
									</span>
								</div>
							</div>
						)}
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						inset
						disabled={!!item.sha && !item.isLocale}
						onClick={newFileHandler}
					>
						{t("context.newFile")}
					</ContextMenuItem>
					<ContextMenuItem
						inset
						disabled={!!item.sha && !item.isLocale}
						onClick={newFolderHandler}
					>
						{t("context.newFolder")}
					</ContextMenuItem>
					<ContextMenuItem inset onClick={handleShowFileManager}>
						{t("context.viewDirectory")}
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem
						inset
						disabled={!item.isLocale}
						onClick={handleCutFolder}
					>
						{t("context.cut")}
					</ContextMenuItem>
					<ContextMenuItem inset onClick={handleCopyFolder}>
						{t("context.copy")}
					</ContextMenuItem>
					<ContextMenuItem
						inset
						disabled={!clipboardItem}
						onClick={handlePasteInFolder}
					>
						{t("context.paste")}
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem inset onClick={handleStartRename}>
						{t("context.rename")}
					</ContextMenuItem>
					<ContextMenuItem
						inset
						className="text-red-900"
						onClick={handleDeleteFolder}
					>
						{t("context.delete")}
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</CollapsibleTrigger>
	);
};

export default FolderItem;
