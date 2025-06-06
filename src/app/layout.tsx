"use client";

import NextIntlProvider from "@/components/providers/NextIntlProvider";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

dayjs.extend(relativeTime);
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head></head>
			<body suppressHydrationWarning>
				<NextIntlProvider>{children}</NextIntlProvider>
				<Toaster />
			</body>
		</html>
	);
}
