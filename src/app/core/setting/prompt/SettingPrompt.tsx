import usePromptStore, { type Prompt } from "@/stores/prompt";
import { useMount } from "@reactuses/core";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import SettingType from "../components/SettingType";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Plus, Trash, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OpenBroswer from "@/components/OpenBroswer";
import { Card, CardContent } from "@/components/ui/card";
import { confirm } from "@tauri-apps/plugin-dialog";

interface SettingPromptProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingPrompt = ({ id, icon }: SettingPromptProps) => {
	const t = useTranslations("settings");
	const commonT = useTranslations("common");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const {
		promptList,
		initPromptData,
		createPrompt,
		savePrompt,
		deletePrompt,
	} = usePromptStore();

	// 打开新增对话框
	const handleOpenAddDialog = () => {
		setNewTitle("");
		setNewContent("");
		setDialogOpen(true);
	};

	// 添加新prompt
	const handleAddPrompt = async () => {
		if (!newTitle.trim()) return;
		await createPrompt({
			title: newTitle,
			content: newContent,
		});
		// 清空表单
		setNewTitle("");
		setNewContent("");
		setDialogOpen(false);
	};

	// 取消编辑
	const handleCancelEdit = () => {
		setEditingId(null);
	};

	// 保存编辑中的prompt
	const handleSaveEdit = async (id: string) => {
		const prompt = promptList.find((p) => p.id === id);
		if (!prompt) return;

		if (!newTitle.trim()) return;
		await savePrompt({
			...prompt,
			title: newTitle,
			content: newContent,
		});
		setEditingId(null);
	};

	// 开始编辑
	const handleStartEdit = (prompt: Prompt) => {
		setEditingId(prompt.id);
		setNewTitle(prompt.title);
		setNewContent(prompt.content);
	};

	const handleDeletePrompt = async (id: string) => {
		const res = await confirm(t("prompt.deletePromptConfirm"), {
			okLabel: commonT("confirm"),
			cancelLabel: commonT("cancel"),
		});
		if (!res) return;
		deletePrompt(id);
	};

	useMount(() => {
		initPromptData();
	});

	return (
		<SettingType
			id={id}
			icon={icon}
			title={t("prompt.title")}
			desc={t("prompt.desc")}
		>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={handleOpenAddDialog}
							>
								<Plus className="size-4 mr-2" />
								{t("prompt.addPrompt")}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									{t("prompt.addPrompt")}
								</DialogTitle>
								<DialogDescription>
									{t("prompt.addPromptDesc")}
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="title">
										{t("prompt.promptTitle")}
									</Label>
									<Input
										id="title"
										value={newTitle}
										onChange={(e) =>
											setNewTitle(e.target.value)
										}
										placeholder={t(
											"prompt.promptTitlePlaceholder"
										)}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="content">
										{t("prompt.promptContent")}
									</Label>
									<Textarea
										id="content"
										value={newContent}
										onChange={(e) =>
											setNewContent(e.target.value)
										}
										rows={5}
										placeholder={t(
											"prompt.promptContentPlaceholder"
										)}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setDialogOpen(false)}
								>
									{commonT("cancel")}
								</Button>
								<Button onClick={handleAddPrompt}>
									{commonT("confirm")}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<OpenBroswer
						title="Awesome Prompts"
						url="https://github.com/f/awesome-chatgpt-prompts"
						className="text-sm"
					/>
				</div>
				<div className="grid gap-4">
					{promptList.map((prompt) => (
						<Card key={prompt.id} className="p-0">
							<CardContent className="p-4">
								{editingId === prompt.id ? (
									<div className="flex flex-col gap-4">
										<Input
											value={newTitle}
											onChange={(e) =>
												setNewTitle(e.target.value)
											}
											placeholder={t(
												"prompt.promptTitlePlaceholder"
											)}
										/>
										<Textarea
											value={newContent}
											onChange={(e) =>
												setNewContent(e.target.value)
											}
											placeholder={t(
												"prompt.promptContentPlaceholder"
											)}
										/>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={handleCancelEdit}
											>
												<X className="size-4 mr-4" />
												{commonT("cancel")}
											</Button>
											<Button
												size="sm"
												onClick={() =>
													handleSaveEdit(prompt.id)
												}
											>
												<Check className="size-4 mr-2" />
												{commonT("save")}
											</Button>
										</div>
									</div>
								) : (
									<div className="flex flex-col gap-2">
										<div className="flex justify-between items-center">
											<h3 className="font-medium">
												{prompt.title}
											</h3>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleStartEdit(prompt)
													}
												>
													<Pencil className="size-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleDeletePrompt(
															prompt.id
														)
													}
													disabled={prompt.isDefault}
												>
													<Trash className="size-4" />
												</Button>
											</div>
										</div>
										<p className=" text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
											{prompt.content ||
												t("prompt.noContent")}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</SettingType>
	);
};

export default SettingPrompt;
