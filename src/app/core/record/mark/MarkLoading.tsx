import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import type { MarkQueue } from "@/stores/mark";

interface MarkLoadingProps {
	mark: MarkQueue;
}

const MarkLoading = ({ mark }: MarkLoadingProps) => {
	const t = useTranslations();
	const [timeNow, setTimeNow] = useState(Date.now());
	const timer = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		// 挂载时执行的时间
		timer.current = setInterval(() => {
			setTimeNow(Date.now());
		}, 1000);
		return () => {
			if (!timer.current) return;
			clearInterval(timer.current);
		};
	}, []);

	return (
		<div className="flex justify-between px-2 items-center gap-1 py-2 text-xs border-b text-zinc-500">
			<div className="flex gap-1">
				<LoaderCircle className="animate-spin size-4" />
				<span className="flex items-center gap-1 bg-zinc-500 text-white px-1 rounded">
					{t(mark.type)}
				</span>
				<span>{mark.progress}...</span>
			</div>
			<time className="text-zinc-400" suppressHydrationWarning>
				{Math.round((timeNow - mark.startTime) / 1000)}s
			</time>
		</div>
	);
};

export default MarkLoading;
