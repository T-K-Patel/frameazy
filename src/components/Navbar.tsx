"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BsCart3 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import Logo from "@/assets/frameasy-logo.png";
import Sidebar from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const pathname = usePathname();
    const sideBarRef = React.useRef<HTMLDivElement>(null);
    const session = useSession();
    const [links, setLinks] = useState([
        {
            name: "Home",
            path: "/",
        },
        {
            name: "Frames",
            path: "/frames",
        },
        {
            name: "Contacts",
            path: "/contact",
        },
    ]);

    const handleOutSideClick = useCallback(
        (e: MouseEvent) => {
            if (sideBarRef.current && !sideBarRef.current.contains(e.target as Node) && showSideBar) {
                setShowSideBar(false);
            }
        },
        [showSideBar],
    );
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", showSideBar);
    }, [showSideBar]);

    useEffect(() => {
        setShowSideBar(false);
        if (pathname.startsWith("/admin")) {
            setLinks([
                {
                    name: "Home",
                    path: "/",
                },
                {
                    name: "Add Product",
                    path: "/admin",
                },
                {
                    name: "Orders",
                    path: "/admin/orders",
                },
                {
                    name: "Messages",
                    path: "/admin/messages",
                },
                {
                    name: "Transactions",
                    path: "/admin/transactions",
                },
                {
                    name: "Subscriptions",
                    path: "/admin/subscriptions",
                },
            ]);
        } else {
            setLinks([
                {
                    name: "Home",
                    path: "/",
                },
                {
                    name: "Frames",
                    path: "/frames",
                },
                {
                    name: "Contacts",
                    path: "/contact",
                },
            ]);
        }
    }, [pathname]);

    useEffect(() => {
        document.addEventListener("click", handleOutSideClick);
        return () => {
            document.removeEventListener("click", handleOutSideClick);
        };
    }, [handleOutSideClick]);

    const toggleSidebar = () => {
        setShowSideBar((s) => !s);
    };

    return (
        <header className="mx-auto max-w-screen-2xl">
            <nav className="mx-auto flex h-[100px] w-11/12 items-center justify-between">
                <a href="/">
                    <Image src={Logo} alt="logo" priority />
                </a>
                <ul className="hidden gap-5 md:flex">
                    {links.map((link, ind) => (
                        <li
                            key={ind}
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
                        <Link href="/auth//login" className="hover:underline">
                            Log in
                        </Link>
                    </div>
                )}
                {session.data?.user && (
                    <div className="hidden w-min items-center gap-5 md:flex">
                        {!pathname.startsWith("/admin") && (
                            <Link href="/cart" className="text-dark-blue flex items-center gap-3">
                                <BsCart3 size={30} />
                                <p className="text-xl font-semibold">Cart</p>
                            </Link>
                        )}
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
                links={links}
                currentUser={session.data?.user}
                pathname={pathname}
            />
        </header>
    );
};

export default Navbar;
