import { TooltipButton } from "@/components/TooltipButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useArticleStore from "@/stores/article";
import { debounce } from "lodash-es";
import {
	ArrowDownAZ,
	ChevronsDownUp,
	ChevronsUpDown,
	FilePlus,
	FolderPlus,
	FolderSync,
	SortAsc,
	SortDesc,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const FileToolbar = () => {
	const t = useTranslations("article.file.toolbar");
	const {
		newFile,
		newFolder,
		sortType,
		sortDirection,
		setSortType,
		setSortDirection,
		collapsibleList,
		toggleAllFolders,
		loadFileTree,
	} = useArticleStore();

	const debounceNewFile = debounce(newFile, 200);
	const debounceNewFolder = debounce(newFolder, 200);
	return (
		<header className="flex justify-between items-center h-12 border-b px-2">
			<div>
				{/* 新建 */}
				<TooltipButton
					icon={<FilePlus />}
					tooltipText={t("newArticle")}
					onClick={debounceNewFile}
				/>
				{/* 新建文件夹 */}
				<TooltipButton
					icon={<FolderPlus />}
					tooltipText={t("newFolder")}
					onClick={debounceNewFolder}
				/>
			</div>
			<div>
				{/* 排序 */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="inline-block items-center">
							<TooltipButton
								tooltipText={t("sort")}
								icon={
									sortDirection === "asc" ? (
										<SortAsc
											className={cn(
												"size-4",
												sortType !== "none" &&
													"text-primary"
											)}
										/>
									) : (
										<SortDesc
											className={cn(
												"size-4",
												sortType !== "none" &&
													"text-primary"
											)}
										/>
									)
								}
							/>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => setSortType("name")}
							className={cn(sortType === "name" && "bg-accent")}
						>
							<ArrowDownAZ className="size-4 mr-2" />
							{t("sortByName")}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setSortType("created")}
							className={cn(
								sortType === "created" && "bg-accent"
							)}
						>
							<ArrowDownAZ className="size-4 mr-2" />
							{t("sortByCreated")}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setSortType("modified")}
							className={cn(
								sortType === "modified" && "bg-accent"
							)}
						>
							<ArrowDownAZ className="size-4 mr-2" />
							{t("sortByModified")}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setSortDirection(
									sortDirection === "asc" ? "desc" : "asc"
								)
							}
							className="border-t mt-1 pt-1"
						>
							{sortDirection === "asc" ? (
								<>
									<SortDesc className="mr-2 h-4 w-4" />
									{t("sortDesc")}
								</>
							) : (
								<>
									<SortAsc className="mr-2 h-4 w-4" />
									{t("sortAsc")}
								</>
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* 折叠/展开 */}
				<TooltipButton
					icon={
						collapsibleList.length > 0 ? (
							<ChevronsDownUp className="size-4" />
						) : (
							<ChevronsUpDown className="size-4" />
						)
					}
					tooltipText={
						collapsibleList.length > 0
							? t("collapseAll")
							: t("expandAll")
					}
					onClick={toggleAllFolders}
				/>
				{/* 刷新 */}
				<TooltipButton
					icon={<FolderSync className="size-4" />}
					tooltipText={t("refresh")}
					onClick={loadFileTree}
				/>
			</div>
		</header>
	);
};

export default FileToolbar;
