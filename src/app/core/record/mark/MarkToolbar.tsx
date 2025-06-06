"use client";

import { Toggle } from "@/components/ui/toggle";
import {
	TooltipTrigger,
	Tooltip,
	TooltipProvider,
	TooltipContent,
} from "@/components/ui/tooltip";
import useMarkStore from "@/stores/mark";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import React, { useEffect } from "react";
import ControllerScan from "./ControllerScan";
import ControllerImage from "./ControllerImage";
import ControllerFile from "./ControllerFile";
import ControllerText from "./ControllerText";
import ControllerLink from "./ControllerLink";

const MarkToolbar = () => {
	const t = useTranslations();
	const { trashState, setTrashState, fetchAllTrashMarks, fetchMarks } =
		useMarkStore();

	useEffect(() => {
		if (trashState) {
			fetchAllTrashMarks();
		} else {
			fetchMarks();
		}
	}, [trashState]);

	return (
		<div className="flex justify-between items-center h-12 border-b px-2">
			<div className="flex">
				<TooltipProvider>
					<ControllerScan />
					<ControllerImage />
					<ControllerFile />
					<ControllerText />
					<ControllerLink />
				</TooltipProvider>
			</div>
			<div className="flex items-center gap-1">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<Toggle
								asChild
								aria-label="Toggle trash"
								className="data-[state=on]:bg-secondary-foreground data-[state=on]:text-secondary"
								pressed={trashState}
								onPressedChange={setTrashState}
								size="sm"
							>
								<div>
									<RotateCcw className="size-4" />
								</div>
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>
							<p>{t("record.mark.toolbar.trash")}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default MarkToolbar;
