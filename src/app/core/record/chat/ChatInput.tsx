import { Textarea } from "@/components/ui/textarea";
import useChatStore from "@/stores/chat";
import useSettingStore from "@/stores/setting";
import React, { useDeferredValue, useState } from "react";
import ModelSelect from "./ModelSelect";

const ChatInput = () => {
	const [text, setText] = useState("");
	const [placeholder, setPlaceholder] = useState("");
	const [isComposing, setIsComposing] = useState(false);
	const { apiKey } = useSettingStore();
	const { loading } = useChatStore();
	useDeferredValue;

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
		const textarea = e.target;
		textarea.style.height = "auto";
		const newHeight = Math.min(textarea.scrollHeight, 240);
		textarea.style.height = `${newHeight}px`;
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Entry" && !isComposing && !e.shiftKey) {
			e.preventDefault();
		}
	};

	return (
		<footer className="relative flex flex-col border rounded-xl p-2 gap-2 mb-2 w-[calc(100%-1rem)]">
			<div className="flex w-full relative items-start">
				<Textarea
					className="flex-1 p-2 relative border-none focus-visible:ring-0 shadow-none min-h-[36px] max-h-[240px] resize-none"
					value={text}
					onChange={handleTextChange}
					placeholder={placeholder}
					disabled={!apiKey || loading}
					onKeyDown={handleKeydown}
					onCompositionStart={() => setIsComposing(true)}
					onCompositionEnd={() =>
						setTimeout(() => setIsComposing(false), 0)
					}
				/>
			</div>
			<div className="flex justify-between items-center w-full">
				<div className="flex">
					<ModelSelect />
				</div>
			</div>
		</footer>
	);
};

export default ChatInput;
