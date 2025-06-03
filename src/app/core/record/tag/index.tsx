import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
} from "@/components/ui/command";
import { initTagsDb, type Tag } from "@/db/tags";
import useTagStore from "@/stores/tag";
import { ArrowUpDown, Lightbulb, TagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TagItem from "./TagItem";
import useMarkStore from "@/stores/mark";
import useChatStore from "@/stores/chat";

const TagManage = () => {
	const t = useTranslations();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const {
		fetchTags,
		initTags,
		currentTag,
		tags,
		setCurrentTagId,
		createTag,
	} = useTagStore();
	const { fetchMarks } = useMarkStore();
	const { init } = useChatStore();

	const quickAddTag = async () => {
		await createTag(name);
		setOpen(false);
		await fetchMarks();
	};

	const handleSelect = async (tag: Tag) => {
		await setCurrentTagId(tag.id);
		setOpen(false);
		await fetchMarks();
		await init(tag.id);
	};

	useEffect(() => {
		const fetchData = async () => {
			await initTagsDb();
			await fetchTags();
			await initTags();
		};
		fetchData();
	}, [initTags, fetchTags]);
	return (
		<>
			<div className="flex gap-1 w-full items-center justify-between px-2">
				<div
					className="w-full h-9 border cursor-pointer rounded flex justify-between items-center px-3 bg-white hover:bg-gray-50 dark:bg-black dark:hover:bg-zinc-800"
					onClick={() => setOpen(true)}
				>
					<div className="flex gap-2 items-center">
						{name == "Idea" ? (
							<Lightbulb className="size-4" />
						) : (
							<TagIcon className="size-4" />
						)}
						<span className="text-xs">
							{currentTag?.name} ({currentTag?.total})
						</span>
					</div>
					<ArrowUpDown className="size-3" />
				</div>
			</div>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder={t("record.mark.tag.searchPlaceholder")}
					onValueChange={(name) => setName(name)}
				/>
				<CommandList>
					<CommandEmpty>
						<p className="text-gray-600">
							{t("record.mark.tag.noResults")}
						</p>
						<Button className="mt-4" onClick={quickAddTag}>
							{t("record.mark.tag.quickAdd")}
						</Button>
					</CommandEmpty>
					<CommandGroup heading={t("record.mark.tag.pinned")}>
						{tags
							.filter((tag) => tag.isPin)
							.map((tag) => (
								<TagItem
									key={tag.id}
									tag={tag}
									onChange={() => {}}
									onSelect={() => handleSelect(tag)}
								/>
							))}
					</CommandGroup>
					<CommandGroup heading={t("record.mark.tag.others")}>
						{tags
							.filter((tag) => !tag.isPin)
							.map((tag) => (
								<TagItem
									key={tag.id}
									tag={tag}
									onChange={() => {}}
									onSelect={() => handleSelect(tag)}
								/>
							))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default TagManage;
