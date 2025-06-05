import React, { useState } from "react";
import SettingType from "../components/SettingType";
import { useTranslations } from "next-intl";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogContent,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useSettingStore, {
	GenTemplateRange,
	type GenTemplate,
} from "@/stores/setting";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { confirm } from "@tauri-apps/plugin-dialog";

interface SettingTemplateProps {
	id: string;
	icon?: React.ReactNode;
}

const SettingTemplate = ({ id, icon }: SettingTemplateProps) => {
	const t = useTranslations("settings.template");
	const commonT = useTranslations("common");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [currentTemplate, setCurrentTemplate] = useState<GenTemplate | null>(
		null
	);
	const { templateList, setTemplateList } = useSettingStore();

	const [templateTitle, setTemplateTitle] = useState("");
	const [templateContent, setTemplateContent] = useState("");
	const [templateRange, setTemplateRange] = useState<GenTemplateRange>(
		GenTemplateRange.All
	);
	const [templateStatus, setTemplateStatus] = useState(true);

	// 打开添加对话框
	const openAddDialog = () => {
		resetForm();
		setDialogOpen(true);
	};

	// 添加模版
	const createTemplateHandler = () => {
		const newTemplate: GenTemplate = {
			id: `${templateList.length + 1}`,
			status: templateStatus,
			title: templateTitle.trim() || t("customTemplate"),
			content: templateContent,
			range: templateRange,
		};
		setTemplateList([...templateList, newTemplate]);
		resetForm();
		setDialogOpen(false);
	};

	// 更新模版
	const updateTemplateHandler = () => {
		if (!currentTemplate) return;

		setTemplateList(
			templateList.map((item) => {
				if (item.id === currentTemplate.id) {
					return {
						...item,
						title: templateTitle,
						content: templateContent,
						range: templateRange,
						status: templateStatus,
					};
				}
				return item;
			})
		);

		setEditDialogOpen(false);
		resetForm();
	};

	// 打开编辑对话框
	const openEditDialog = (template: GenTemplate) => {
		setCurrentTemplate(template);
		setTemplateTitle(template.title);
		setTemplateContent(template.content);
		setTemplateRange(template.range);
		setTemplateStatus(template.status);
		setEditDialogOpen(true);
	};

	// 删除模版
	const deleteTemplateHandler = async (id: string) => {
		const res = await confirm(t("deleteConfirm"), {
			okLabel: commonT("confirm"),
			cancelLabel: commonT("cancel"),
		});
		if (!res) return;
		setTemplateList(templateList.filter((item) => item.id !== id));
	};

	// 重置表单
	const resetForm = () => {
		setTemplateTitle("");
		setTemplateContent("");
		setTemplateRange(GenTemplateRange.All);
		setTemplateStatus(true);
		setCurrentTemplate(null);
	};

	return (
		<SettingType id={id} icon={icon} title={t("title")}>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={openAddDialog}
							>
								<Plus className="size-4 mr-4" />
								{t("addTemplate")}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("addTemplate")}</DialogTitle>
								<DialogDescription>
									{t("addTemplateDesc") ||
										t("customTemplate")}
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="title">{t("name")}</Label>
									<Input
										id="title"
										value={templateTitle}
										onChange={(e) =>
											setTemplateTitle(e.target.value)
										}
										placeholder={t("name")}
									/>
								</div>
								<div className="grid gap-2">
									<div className="flex justify-between">
										<Label htmlFor="range">
											{t("scope")}
										</Label>
										<div className="flex items-center gap-2">
											<Label htmlFor="status">
												{t("status")}
											</Label>
											<Switch
												id="status"
												checked={templateStatus}
												onCheckedChange={
													setTemplateStatus
												}
											/>
										</div>
									</div>
									<Select
										value={templateRange}
										onValueChange={(
											value: GenTemplateRange
										) => setTemplateRange(value)}
									>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={t("selectScope")}
											/>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{Object.values(
													GenTemplateRange
												).map((value) => (
													<SelectItem
														key={value}
														value={value}
													>
														{value}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="content">
										{t("content")}
									</Label>
									<Textarea
										id="content"
										rows={5}
										value={templateContent}
										onChange={(e) =>
											setTemplateContent(e.target.value)
										}
										placeholder={t("content")}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setDialogOpen(false)}
								>
									{commonT("cancel") || "Cancel"}
								</Button>
								<Button onClick={createTemplateHandler}>
									{commonT("confirm") || "Confirm"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{t("editTemplate") || "Edit Template"}
							</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-title">{t("name")}</Label>
								<Input
									id="edit-title"
									value={templateTitle}
									onChange={(e) =>
										setTemplateTitle(e.target.value)
									}
									placeholder={t("name")}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex justify-between">
									<Label htmlFor="edit-range">
										{t("scope")}
									</Label>
									<div className="flex items-center gap-2">
										<Label htmlFor="edit-status">
											{t("status")}
										</Label>
										<Switch
											id="edit-status"
											checked={templateStatus}
											onCheckedChange={setTemplateStatus}
											disabled={
												currentTemplate?.id === "0"
											}
										/>
									</div>
								</div>
								<Select
									value={templateRange}
									onValueChange={(value: GenTemplateRange) =>
										setTemplateRange(value)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={t("selectScope")}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{Object.values(
												GenTemplateRange
											).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{value}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-content">
									{t("content")}
								</Label>
								<Textarea
									id="edit-content"
									rows={5}
									value={templateContent}
									onChange={(e) =>
										setTemplateContent(e.target.value)
									}
									placeholder={t("content")}
								></Textarea>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setEditDialogOpen(false)}
							>
								{commonT("cancel") || "Cancel"}
							</Button>
							<Button onClick={updateTemplateHandler}>
								{commonT("confirm") || "Confirm"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<div className="grid gap-4">
					{templateList.map((item) => (
						<Card key={item.id} className="p-0">
							<CardContent className="p-4">
								<div className="flex flex-col gap-2">
									<div className="flex justify-between items-center">
										<div
											className={cn(
												!item.status && "opacity-50"
											)}
										>
											<h3 className=" font-medium">
												{item.title}
											</h3>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													openEditDialog(item)
												}
											>
												<Pencil className="size-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													deleteTemplateHandler(
														item.id
													)
												}
												disabled={item.id === "0"}
											>
												<Trash className="size-4" />
											</Button>
										</div>
									</div>
									<div className="text-sm text-muted-foreground">
										{t("scope")}:{" "}
										<span className="font-medium">
											{item.range}
										</span>
									</div>
									<p
										className={cn(
											"text-sm whitespace-pre-wrap mt-2 line-clamp-3",
											!item.status && "opacity-50"
										)}
									>
										{item.content ||
											t("noContent") ||
											"No content"}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</SettingType>
	);
};

export default SettingTemplate;
