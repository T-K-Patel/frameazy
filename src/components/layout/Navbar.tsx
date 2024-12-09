"use client";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import Logo from "@/assets/frameasy-logo.png";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "./SideBar";
import Image from "next/image";

const USER_PAGE_LINKS = [
	{
		name: "Home",
		path: "/",
	},
	{
		name: "Frames",
		path: "/frames",
	},
	{
		name: "Contact Us",
		path: "/contact",
	},
];

function Navbar() {
	const [showSideBar, setShowSideBar] = React.useState(false);
	const pathname = usePathname();
	const sideBarRef = React.useRef<HTMLDivElement>(null);
	const session = useSession();
	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", showSideBar);
	}, [showSideBar]);

	const handleOutSideClick = useCallback(
		function (e: MouseEvent) {
			if (sideBarRef.current && !sideBarRef.current.contains(e.target as Node) && showSideBar) {
				setShowSideBar(false);
			}
		},
		[sideBarRef, showSideBar],
	);

	useEffect(() => {
		document.addEventListener("click", handleOutSideClick);
		return () => {
			document.removeEventListener("click", handleOutSideClick);
		};
	}, [handleOutSideClick]);

	const toggleSidebar = () => {
		setShowSideBar((s) => !s);
	};

	if (pathname == "/auth/login") return null;
	if (pathname.startsWith("/admin") || pathname.startsWith("/customize")) return null;

	return (
		<header className="mx-auto max-w-screen-2xl">
			<nav className="mx-auto flex h-[100px] w-11/12 items-center justify-between">
				<Link href="/">
					{/* <Img src={Logo.src} alt="logo" loading="eager" /> */}
					<Image
						src={Logo.src}
						alt="logo"
						width={120}
						height={120}
						className="w-36 cursor-pointer"
						loading="eager"
						quality={100}
						unoptimized
					/>
				</Link>
				<ul className="hidden gap-5 md:flex">
					{USER_PAGE_LINKS.map((link, ind) => (
						<li
							key={link.path + link.name + ind}
							className={
								pathname === link.path
									? "text-dark-blue font-bold"
									: "text-[#00000084] hover:text-black"
							}
						>
							<Link href={link.path}>{link.name}</Link>
						</li>
					))}
				</ul>
				{!session.data?.user && (
					<div className="text-dark-blue hidden items-center gap-5 font-bold md:flex">
						<Link href="/" as={"/auth/login"} className="hover:underline">
							Log in
							{/* <Button size={"sm"} className="h-auto py-4 transition-all duration-200 active:scale-90">
							</Button> */}
						</Link>
					</div>
				)}
				{session.data?.user && (
					<div className="hidden w-min items-center gap-5 md:flex">
						<Link href="/cart" className="text-dark-blue flex items-center gap-3">
							<BsCart3 size={30} />
							<p className="text-xl font-semibold">Cart</p>
						</Link>
						{session.data.user.role == "admin" ? (
							<Link href="/admin">
								<Button
									size={"sm"}
									className="h-auto w-min py-4 transition-all duration-200 active:scale-90"
								>
									Admin
								</Button>
							</Link>
						) : (
							<Link href="/dashboard">
								<Button
									size={"sm"}
									className="h-auto w-min py-4 transition-all duration-200 active:scale-90"
								>
									Dashboard
								</Button>
							</Link>
						)}
					</div>
				)}
				<div
					className="flex cursor-pointer md:hidden"
					onClick={() => {
						setShowSideBar(!showSideBar);
					}}
				>
					<RxHamburgerMenu size="24px" />
				</div>
			</nav>
			<Sidebar
				barRef={sideBarRef}
				toggle={toggleSidebar}
				showSideBar={showSideBar}
				links={USER_PAGE_LINKS}
				currentUser={session.data?.user}
				pathname={pathname}
			/>
		</header>
	);
}

export default Navbar;
