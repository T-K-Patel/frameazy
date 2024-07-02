"use client";
import { FaTimes } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import Link from "next/link";
import { signOutAction } from "@/serverActions/auth/signout";
import { Button } from "./ui/button";

type SideBarPropType = {
    toggle: () => void;
    links: {
        id: string;
        name: string;
        path: string;
    }[];
    barRef: React.RefObject<HTMLDivElement>;
    showSideBar: boolean;
    currentUser: any;
    pathname: string;
};

const Sidebar = ({ toggle, links, showSideBar, currentUser, pathname, barRef }: SideBarPropType) => {
    return (
        <>
            {/* OverLay */}
            {showSideBar && (
                <div className="fixed left-0 top-0 z-10 h-screen w-screen bg-black bg-opacity-15 md:hidden" />
            )}
            <div
                ref={barRef}
                className={`fixed top-0 z-30 h-screen w-48 bg-white px-5 text-right shadow-xl duration-300 ease-in-out md:hidden ${
                    showSideBar ? "right-0" : "right-[-100%]"
                }`}
            >
                <div className="flex h-full flex-col justify-between pb-7">
                    <div>
                        <FaTimes
                            size={24}
                            onClick={toggle}
                            className="mb-16 mt-8 inline-block cursor-pointer text-right"
                        />
                        <ul className="flex flex-col gap-5">
                            {links.map((link) => (
                                <li
                                    key={link.id}
                                    className={pathname === link.path ? "text-dark-blue font-bold" : "text-[#00000084]"}
                                >
                                    <Link href={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {!currentUser && (
                        <div className="text-dark-blue flex h-[300px] flex-col items-center justify-end gap-5 font-bold">
                            <Link href="login" className="hover:underline">
                                Log in
                            </Link>
                            <Link href="/signup">
                                <Button size={"sm"} className="w-min py-1 transition-all duration-200 active:scale-90">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                    {currentUser && (
                        <div className="flex flex-col items-center justify-end gap-5">
                            <Link href="/cart" className="text-dark-blue flex items-center gap-3">
                                <BsCart3 size={30} />
                                <p className="text-xl font-semibold">Cart</p>
                            </Link>
                            <form action={signOutAction}>
                                <Button
                                    size={"sm"}
                                    className="h-min w-min py-5 transition-all duration-200 active:scale-90"
                                >
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
