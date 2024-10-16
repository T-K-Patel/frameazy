"use server";
import { NextRequest, NextResponse, type MiddlewareConfig } from "next/server";
// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//     callbacks: {
//         authorized: async ({ req }) => {
//             const cookies = req.cookies;
//             const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
//             const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
//             try {
//                 let session: any = await fetch(
//                     `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/session`,
//                     {
//                         method: "GET",
//                         headers: { Cookie: `${cookieName}=${cookies.get(cookieName)?.value}` },
//                     },
//                 );
//                 session = await session.json();
//                 // console.log("Req Pathname:\n\n", req.nextUrl.pathname, "\n\n");
//                 // if (req.nextUrl.pathname.startsWith("/admin") && session.user.role !== "admin") {
//                 //     return false;
//                 // }
//                 return !!session.user;
//             } catch (error) {
//                 console.error("authorized error", error);
//                 return false;
//             }
//         },
//     },
// });

export default async function middleware(req: NextRequest) {
    const cookies = req.cookies;
    const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
    const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
    try {
        let session: any = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/session`,
            {
                method: "GET",
                headers: { Cookie: `${cookieName}=${cookies.get(cookieName)?.value}` },
            },
        );
        session = await session.json();
        console.log("Req Pathname:\n\n", req.nextUrl.pathname, "\n\n");
        if (req.nextUrl.pathname.startsWith("/admin") && session?.user?.role !== "admin") {
            const redirUrl = req.nextUrl;
            redirUrl.searchParams.set("next", req.nextUrl.pathname);
            redirUrl.pathname = "/auth/login";
            const resp = NextResponse.redirect(redirUrl, { status: 302 });
            resp.cookies.delete(cookieName);
            return resp;
        }
        return NextResponse.next();
    } catch (error) {
        console.error("authorized error", error);
        return new NextResponse(
            `
            <html>
                <body>
                    <h1>Something went wrong</h1>
                </body>
            </html>
            `,
            { status: 500, headers: { "Content-Type": "text/html" } },
        );
    }
}

export const config: MiddlewareConfig = {
    matcher: ["/admin/:path*"],
};
