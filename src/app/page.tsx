"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const init = () => {
		redirect("/core/record");
	};

	useEffect(() => {
		init();
	}, []);
}
