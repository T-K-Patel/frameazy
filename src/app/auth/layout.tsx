import Image from "next/image";
import React from "react";
import AuthImage from "@/assets/frame-sign.png";

const layout = async ({ children }: { children: React.ReactNode }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
