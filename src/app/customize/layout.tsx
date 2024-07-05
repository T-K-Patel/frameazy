"use client";
import { useFrames } from "@/components/frames-context";
import { redirect, RedirectType, usePathname, useRouter } from "next/navigation";
import React from "react";
import CNavBar from "./CNavBar";
import { useSession } from "next-auth/react";

function Layout({ children }: { children: React.ReactNode }) {
    const session = useSession();

    const { frameOptions: framing } = useFrames();
    const router = useRouter();
    const pathname = usePathname();
    if (session.status == "loading") {
        return <></>;
    }
    if (session.status == "unauthenticated") {
        redirect("/auth/login");
    }
    if (framing.framingStyle == "none") {
        redirect("/", RedirectType.replace);
    }
    if (pathname != `/customize/${framing.framingStyle}`) {
        redirect(`/customize/${framing.framingStyle}`, RedirectType.replace);
    }
    return (
        <>
            <CNavBar />
            <section>
                <div className="mx-auto w-11/12 max-w-screen-2xl">{children}</div>
            </section>
        </>
    );
}

export default Layout;
