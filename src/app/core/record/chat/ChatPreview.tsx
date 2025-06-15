import React, { useEffect, useRef, useState } from "react";
import { ExposeParam, MdPreview, Themes } from "md-editor-rt";
import useSettingStore from "@/stores/setting";
import useChatStore from "@/stores/chat";
import { useTheme } from "next-themes";
import { debounce } from "lodash-es";
interface ChatPreviewProps {
	text: string;
}

const ChatPreview = ({ text }: ChatPreviewProps) => {
	const [id] = useState("preview-only");
	const [mdTheme, setMdTheme] = useState<Themes>("light");
	const { codeTheme, previewTheme } = useSettingStore();
	const { chats } = useChatStore();
	const { theme } = useTheme();
	const ref = useRef<ExposeParam>(null);

	const bindPreviewLink = () => {
		setTimeout(() => {
			const previewDoms = document.querySelectorAll(".md-editor");
			for (let index = 0; index < previewDoms.length; index++) {
				const previewDom = previewDoms[index];
				if (!previewDom) continue;
				previewDom.querySelectorAll("a").forEach((item) => {
					item.setAttribute("target", "_blank");
					item.setAttribute("rel", "noopener noreferrer");
				});
			}
		}, 100);
	};

	const bindPreviewLinkDebounce = debounce(bindPreviewLink, 1000);

	useEffect(() => {
		bindPreviewLinkDebounce();
	}, [chats]);

	useEffect(() => {
		if (theme === "system") {
			if (
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			) {
				setMdTheme("dark");
			} else {
				setMdTheme("light");
			}
		} else {
			setMdTheme(theme as Themes);
		}
	}, [theme]);

	return (
		<div>
			<MdPreview
				id={id}
				ref={ref}
				className="flex-1"
				value={text}
				theme={mdTheme}
				codeTheme={codeTheme}
				previewTheme={previewTheme}
			/>
		</div>
	);
};

export default ChatPreview;
