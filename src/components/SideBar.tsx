"use client"
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
}

const Sidebar = ({ toggle, links, showSideBar, currentUser, pathname, barRef }: SideBarPropType) => {

    return (
        <>
            {/* OverLay */}
            {showSideBar && <div className="fixed top-0 left-0 z-10 h-screen w-screen bg-black bg-opacity-15" />}
            <div
                ref={barRef}
                className={`fixed top-0 w-48 bg-white h-screen md:hidden text-right px-5 ease-in-out duration-300 shadow-xl z-30 ${showSideBar ? "right-0" : "right-[-100%]"
                    }`}
            >
                <div className="flex flex-col justify-between h-full pb-7">
                    <div><FaTimes
                        size={24}
                        onClick={toggle}
                        className="cursor-pointer mt-8 mb-16 text-right inline-block"
                    />
                        <ul className="flex flex-col gap-5">
                            {links.map((link) => (
                                <li
                                    key={link.id}
                                    className={
                                        pathname === link.path
                                            ? "font-bold text-dark-blue"
                                            : "text-[#00000084]"
                                    }
                                >
                                    <Link href={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul></div>
                    {!currentUser && (
                        <div className="flex flex-col items-center gap-5 text-dark-blue font-bold justify-end h-[300px]">
                            <Link href="login" className="hover:underline">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="border border-solid border-dark-blue px-5 py-3 rounded-xl hover:text-white hover:bg-dark-blue"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                    {currentUser && (
                        <div className="flex flex-col gap-5 items-center justify-end">
                            <Link href="/cart" className="flex gap-3 items-center text-dark-blue">
                                <BsCart3 size={30} />
                                <p className=" text-xl font-semibold">Cart</p>
                            </Link>
                            <form action={signOutAction}>
                                <Button size={'sm'} className="w-min h-min py-5">
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    )}</div>
            </div>
        </>
    );
};

export default Sidebar;
