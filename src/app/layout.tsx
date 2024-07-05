"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { FramesProvider } from "@/components/frames-context";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <SessionProvider>
                    <FramesProvider>
                        <div className="_next">{children}</div>
                    </FramesProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
