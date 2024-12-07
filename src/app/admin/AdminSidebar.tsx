"use client";

import * as React from "react";
import { BookOpen, ChevronRight, Home, LogOut, PieChart, Settings2 } from "lucide-react";

// import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
// import { NavSecondary } from "./nav-secondary";
// import { NavUser } from "./nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BiLeftArrowAlt, BiPlus } from "react-icons/bi";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "#",
			icon: PieChart,
			isActive: true,
			items: [
				{
					title: "Orders",
					url: "/admin/orders",
				},
				{
					title: "Messages",
					url: "/admin/messages",
				},
				{
					title: "Transactions",
					url: "/admin/transactions",
				},
				{
					title: "Subscriptions",
					url: "/admin/subscriptions",
				},
			],
		},
		{
			title: "Academics",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Course Registration",
					url: "#",
				},
				{
					title: "Current Courses",
					url: "#",
				},
				{
					title: "Grade Sheet",
					url: "#",
				},
				{
					title: "Academic Calendar",
					url: "#",
				},
			],
		},
		{
			title: "Student Services",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "Fee Payment",
					url: "#",
				},
				{
					title: "File Complaint",
					url: "#",
				},
				{
					title: "Document Requests",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Home",
			url: "/admin",
			icon: Home,
		},
		{
			title: "Add Frame",
			url: "/admin/addProduct",
			icon: BiPlus,
		},
	],
};

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="rounded-lg">FA</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{user.name}</span>
						<span className="truncate text-xs">{user.email}</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarMenuButton asChild className="justify-center bg-red-600 text-white hover:bg-red-500">
					<Link href="/admin">
						<LogOut />
						<span>Logout</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarMenuButton className="justify-center bg-slate-900 text-white" asChild>
					<Link href="/admin">
						<BiLeftArrowAlt />
						<span>Go to Main Site</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { user: { name: string; email: string; avatar: string } }) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/admin">
								{/* eslint-disable-next-line prettier/prettier */}
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
									<Image
										src={"/frameasy-logo.png"}
										alt="logo"
										width={96}
										height={96}
										className="size-8"
									/>
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Frameazy admin</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* NavSecondary */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.navSecondary.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild size="sm">
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{/* Navmain */}
				<SidebarGroup>
					{/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
					<SidebarMenu>
						{data.navMain.map((item) => (
							<Collapsible key={item.title} asChild defaultOpen={item.isActive}>
								<SidebarMenuItem>
									<SidebarMenuButton asChild tooltip={item.title}>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
									{item.items?.length ? (
										<>
											<CollapsibleTrigger asChild>
												<SidebarMenuAction className="data-[state=open]:rotate-90">
													<ChevronRight />
													<span className="sr-only">Toggle</span>
												</SidebarMenuAction>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items?.map((subItem) => (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton asChild>
																<Link href={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</>
									) : null}
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>
				{/* <NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
				<NavSecondary items={data.navSecondary} className="mt-auto" /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
