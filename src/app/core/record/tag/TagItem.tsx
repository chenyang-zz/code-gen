import { Button } from "@/components/ui/button";
import { CommandItem, CommandShortcut } from "@/components/ui/command";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { type Tag } from "@/db/tags";
import { cn } from "@/lib/utils";
import useTagStore from "@/stores/tag";
import { Pin, TagIcon, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface TagItemProps {
	tag: Tag;
	onChange: () => void;
	onSelect: () => void;
}

const TagItem = ({ tag, onChange, onSelect }: TagItemProps) => {
	const t = useTranslations();
	const [isEditing, setIsEditing] = useState(false);
	const { currentTagId, deleteTag, saveTag } = useTagStore();

	const handleSelect = () => {
		if (!isEditing) {
			onSelect();
		}
	};

	const updateName = async (name: string) => {
		setIsEditing(false);
		await saveTag({ ...tag, name });
		onChange();
	};

	const togglePin = async () => {
		await saveTag({ ...tag, isPin: !tag.isPin });
		onChange();
	};

	const handleDel = async () => {
		await deleteTag(tag.id);
		onChange();
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger onClick={handleSelect}>
				<CommandItem
					className={cn(
						tag.id === currentTagId && "!bg-primary",
						"data-[selected=true]:bg-transparent flex justify-between items-center w-full cursor-pointer"
					)}
				>
					<div
						className={cn(
							tag.id === currentTagId &&
								"text-primary-foreground",
							"flex gap-2 items-center"
						)}
					>
						<ItemIcon isLocked={tag.isLocked} isPin={tag.isPin} />
						<ItemContent
							value={tag.name}
							isEditing={isEditing}
							onChange={updateName}
						/>
					</div>
					<CommandShortcut>{tag.total ?? 0}</CommandShortcut>
				</CommandItem>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					inset
					disabled={tag.isLocked}
					onClick={togglePin}
				>
					{tag.isPin
						? t("record.mark.tag.unpin")
						: t("record.mark.tag.pin")}
				</ContextMenuItem>
				<ContextMenuItem
					inset
					disabled={isEditing}
					onClick={() => setIsEditing(true)}
				>
					{t("record.mark.tag.rename")}
				</ContextMenuItem>
				<ContextMenuItem
					inset
					disabled={tag.isLocked}
					onClick={handleDel}
				>
					{t("record.mark.tag.delete")}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

const ItemIcon = ({ isLocked = false, isPin = false }) => {
	if (isLocked) {
		return <Lock className="scale-75 text-gray-500" />;
	} else {
		if (isPin) {
			return <Pin className="scale-75 text-gray-500" />;
		} else {
			return <TagIcon className="scale-75 text-gray-500" />;
		}
	}
};

const ItemContent = ({
	value,
	isEditing,
	onChange,
}: {
	value: string;
	isEditing: boolean;
	onChange: (name: string) => void;
}) => {
	const t = useTranslations();
	const [name, setName] = useState(value);
	if (isEditing) {
		return (
			<div className="flex w-full max-w-sm items-center space-x-2">
				<Input
					className="w-[320px]"
					type="text"
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
				<Button
					type="submit"
					onClick={async () => {
						onChange(name);
					}}
				>
					{t("record.mark.tag.rename")}
				</Button>
			</div>
		);
	} else {
		return <span>{value}</span>;
	}
};

export default TagItem;
