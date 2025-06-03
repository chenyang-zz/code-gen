import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="flex flex-1  overflow-hidden w-[calc(100vw-48px)] h-screen">
				<main className="flex flex-1  overflow-hidden w-[calc(100vw-48px)] h-screen">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
