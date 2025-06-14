import { TooltipButton } from "@/components/TooltipButton";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Store from "@/lib/store";
import useChatStore from "@/stores/chat";
import useSettingStore, { type GenTemplate } from "@/stores/setting";
import { useUpdateEffect } from "@reactuses/core";
import { NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { RefObject, useImperativeHandle, useRef, useState } from "react";

interface MarkGenProps {
	inputValue?: string;
	ref: RefObject<{ openGen: () => void } | null>;
}

const MarkGen = ({ inputValue, ref }: MarkGenProps) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState("0");
	const [genTemplate, setGenTemplate] = useState<GenTemplate[]>([]);
	const { apiKey } = useSettingStore();
	const { loading, setLoading } = useChatStore();
	const abortControllerRef = useRef<AbortController | null>(null);

	useImperativeHandle(ref, () => ({
		openGen,
	}));

	const initGenTemplates = async () => {
		const template = (await Store.get<GenTemplate[]>("templateList")) || [];
		console.log(template);

		setGenTemplate(template);
	};

	const openGen = () => {
		setOpen(true);
		initGenTemplates();
	};

	const handleSetting = () => {
		router.push("/core/setting/template");
	};

	const handleGen = () => {};

	const terminateChat = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			setLoading(false);
		}
	};

	useUpdateEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!open) return;
			if (e.key === "Enter" && !e.isComposing) {
				e.preventDefault();
				handleGen();
			} else if (e.key === "Escape") {
				e.preventDefault();
				setOpen(false);
			} else if (e.key === "Escape" && loading) {
				e.preventDefault();
				terminateChat();
			}
		};

		setTimeout(() => {
			window.addEventListener("keydown", handleKeyDown);
		}, 500);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, loading]);
	return (
		<AlertDialog open={open} onOpenChange={openGen}>
			<AlertDialogTrigger className="relative" asChild>
				<TooltipButton
					size="sm"
					variant="default"
					icon={<NotebookPen />}
					disabled={loading || !apiKey}
					tooltipText="整理"
				/>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>将记录整理成...</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<Tabs
							defaultValue={tab}
							onValueChange={(value) => setTab(value)}
						>
							<TabsList>
								{genTemplate.map((item) => (
									<TabsTrigger value={item.id} key={item.id}>
										{item.title}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="px-2 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">模版内容</Label>
						<ScrollArea className="h-32 w-full p-2 rounded-md border">
							<p className="text-xs text-muted-foreground whitespace-pre-wrap">
								{
									genTemplate.find((item) => item.id === tab)
										?.content
								}
							</p>
						</ScrollArea>
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">记录选择范围</Label>
						<p className="text-xs text-muted-foreground">
							{genTemplate.find((item) => item.id === tab)?.range}
						</p>
					</div>
				</div>
				<AlertDialogFooter>
					<Button
						variant={"ghost"}
						disabled={loading}
						onClick={handleSetting}
					>
						管理模板
					</Button>
					<Button variant={"outline"} onClick={() => setOpen(false)}>
						取消
					</Button>
					<Button onClick={handleGen}>开始整理</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default MarkGen;
