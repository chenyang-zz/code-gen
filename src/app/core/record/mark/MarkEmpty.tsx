import { Highlighter } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const MarkEmpty = () => {
	const t = useTranslations();
	return (
		<div className="flex flex-col justify-center items-center flex-1 w-full pt-32">
			<Highlighter className="size-16 opacity-10 mb-2" />
			<p className="text-zinc-500 opacity-30">{t("record.mark.empty")}</p>
		</div>
	);
};

export default MarkEmpty;
