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
import { signOut, useSession } from "next-auth/react";

const AdminNavbar = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const pathname = usePathname();
    const sideBarRef = React.useRef<HTMLDivElement>(null);
    const session = useSession();

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

    const links = [
        {
            id: "1",
            name: "Home",
            path: "/",
        },
        {
            id: "2",
            name: "Orders",
            path: "/admin",
        },
        {
            id: "3",
            name: "Messages",
            path: "/admin/messages",
        },
        {
            id: "4",
            name: "Transactions",
            path: "/admins/transactions",
        },
        {
            id: "5",
            name: "Subscriptions",
            path: "/admins/subscriptions",
        },
    ];
    return (
        <header className="mx-auto max-w-screen-2xl">
            <nav className="mx-auto flex h-[100px] w-11/12 items-center justify-between">
                <a href="/">
                    <Image src={Logo} alt="logo" priority />
                </a>
                <ul className="hidden gap-5 md:flex">
                    {links.map((link) => (
                        <li
                            key={link.id}
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
                        <Link href="auth//signup">
                            <Button
                                size={"sm"}
                                className="h-auto w-min py-4 transition-all duration-200 active:scale-90"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                )}
                {session.data?.user && (
                    <div className="hidden w-min items-center gap-5 md:flex">
                        <Link href="/cart" className="text-dark-blue flex items-center gap-3">
                            <BsCart3 size={30} />
                            <p className="text-xl font-semibold">Cart</p>
                        </Link>
                        <>
                            <Button
                                size={"lg"}
                                onClick={async () => {
                                    await signOut({ redirect: true });
                                }}
                                className="h-auto w-fit px-5 py-4 transition-all duration-200 active:scale-90"
                            >
                                Sign Out
                            </Button>
                        </>
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

export default AdminNavbar;