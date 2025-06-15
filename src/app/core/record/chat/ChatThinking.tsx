import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Chat } from "@/db/chats";
import { Brain, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface ChatThinkingProps {
	chat: Chat;
}

const ChatThinking = ({ chat }: ChatThinkingProps) => {
	const t = useTranslations();
	const [isThinkOpen, setIsThinkOpen] = useState(true);

	const content = chat.content?.includes("<thinking>")
		? chat.content.split("<thinking>")[2]
		: chat.content;
	const thinkingContent = chat.content?.split("<thinking>")[1] || "";

	return (
		chat.content?.includes("<thinking>") && (
			<Collapsible
				open={isThinkOpen}
				onOpenChange={setIsThinkOpen}
				className="w-full border rounded-lg p-4 mb-4"
			>
				<div className="flex items-center justify-between">
					<h4 className="text-sm font-semibold flex items-center gap-2">
						<span className="ml-auto">
							{content ? (
								<Brain className="size-4" />
							) : (
								<LoaderCircle className="animate-spin size-4" />
							)}
						</span>
						<span className="font-bold">{t("ai.thinking")}</span>
					</h4>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm">
							<ChevronsUpDown className="size-4" />
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<p className="mt-2 text-justify text-muted-foreground">
						{thinkingContent}
					</p>
				</CollapsibleContent>
			</Collapsible>
		)
	);
};

export default ChatThinking;
