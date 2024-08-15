import AdminNavbar from "@/components/AdminNavbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminNavbar />
            {children}
        </>
    );
}
