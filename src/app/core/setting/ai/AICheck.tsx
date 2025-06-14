import { checkAiStatus } from "@/lib/ai";
import useSettingStore from "@/stores/setting";
import { useUpdateEffect } from "@reactuses/core";
import { debounce } from "lodash-es";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import React, { useCallback, useState } from "react";

const AICheck = () => {
	const [state, setState] = useState<"ok" | "error" | "checking">("checking");
	const { aiType, apiKey, model, baseURL } = useSettingStore();

	const check = async () => {
		setState("checking");
		setTimeout(async () => {
			const aiState = await checkAiStatus();
			if (aiState) {
				setState("ok");
			} else {
				setState("error");
			}
		}, 500);
	};

	const debouncedCheck = useCallback(debounce(check, 500), []);

	useUpdateEffect(() => {
		debouncedCheck();
	}, [aiType, apiKey, model, baseURL]);

	if (state === "ok") {
		return <CircleCheck className="size-4 text-green-500" />;
	} else if (state === "error") {
		return <CircleX className="text-red-500 size-4" />;
	} else {
		return <LoaderCircle className="animate-spin size-4" />;
	}
};

export default AICheck;
