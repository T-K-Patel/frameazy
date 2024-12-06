import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import IsAuthenticated from "./IsAuthenticated";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<IsAuthenticated>
			<Navbar />
			{children}
			<Footer />
		</IsAuthenticated>
	);
}
