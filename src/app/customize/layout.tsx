"use client";
import React from "react";
import CNavBar from "./CNavBar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
	const session = useSession();
	if (session.status == "unauthenticated") {
		redirect("/auth/login");
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
