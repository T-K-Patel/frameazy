"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import DialogProvider from "./DialogContext";
function ContextProviders({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<DialogProvider>{children}</DialogProvider>
		</SessionProvider>
	);
}

export default ContextProviders;
