"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function IsAuthenticated({ children }: { children: React.ReactNode }) {
    const { data } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    if (!data?.user?.id) {
        router.push("/auth/login?next=" + pathname);
        return <div>Not authenticated</div>;
    }
    return <>{children}</>;
}

export default IsAuthenticated;
