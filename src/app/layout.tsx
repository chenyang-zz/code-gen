"use client";

import NextIntlProvider from "@/components/providers/NextIntlProvider";
import "./globals.css";

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
			</body>
		</html>
	);
}
