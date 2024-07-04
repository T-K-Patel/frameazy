"use client";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import React from "react";
import AuthImage from "@/assets/frame-sign.png";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid h-screen md:grid-cols-2">
            <div className="h-screen">{children}</div>
            <div className="max-md:hidden">
                <Image src={AuthImage} alt="Auth Image" className="h-screen w-full" objectPosition="center" />
            </div>
        </div>
    );
};

export default layout;
