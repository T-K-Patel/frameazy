"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

const resourseNameMap: { [k: string]: string } = {
	addProduct: "Add Product",
	addCategory: "Add Category",
	addCollection: "Add Collection",
	addColor: "Add Color",
	orders: "Orders",
	messages: "Messages",
	transactions: "Transactions",
	subscriptions: "Subscriptions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	const session = useSession();
	const pathname = usePathname();
	const resourceName = resourseNameMap[pathname.split("/")[2]] || "Dashboard";
	return (
		<>
			<SidebarProvider className="h-full w-full">
				<AppSidebar
					user={{
						name: session?.data?.user?.name || "---",
						email: session?.data?.user?.email || "---",
						avatar: session?.data?.user?.image || "",
					}}
				/>
				<SidebarInset>
					<div className="w-full px-4">
						<header className="flex h-16 shrink-0 items-center gap-2">
							<div className="flex items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className="mr-2 h-4" />
								<h1 className="text-xl font-semibold">Admin Panel | {resourceName}</h1>
							</div>
						</header>
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
