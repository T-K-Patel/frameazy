"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { FramesProvider } from "./frames-context";

function ContextProviders({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<FramesProvider>{children}</FramesProvider>
		</SessionProvider>
	);
}

export default ContextProviders;
