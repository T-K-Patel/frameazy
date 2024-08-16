"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const session = useSession();
    if (session.data?.user?.role != "admin") {
        signOut().then(() => {
            redirect(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
        });
    }
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
