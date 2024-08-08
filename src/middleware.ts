"use server";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { type NextRequest, NextResponse, type MiddlewareConfig } from "next/server";

// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: async ({ req }) => {
            const cookies = req.cookies;
            const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
            const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
            const session = await (
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/session`, {
                    method: "GET",
                    headers: { Cookie: `${cookieName}=${cookies.get(cookieName)?.value}` },
                })
            ).json();
            return !!session.user;
        },
    },
});

export const config: MiddlewareConfig = {
    // matcher: [],
    matcher: ["/cart", "/customize/:path*", "/checkout", "/account", "/admin/:path*"],
};
