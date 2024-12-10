import { NextRequest, NextResponse, type MiddlewareConfig } from "next/server";

export default async function middleware(req: NextRequest) {
	const cookies = req.cookies;
	const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	const cookieName = secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token";
	try {
		let session: any = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/session`,
			{
				method: "GET",
				headers: { Cookie: `${cookieName}=${cookies.get(cookieName)?.value}` },
			},
		);
		session = await session.json();
		if (session?.user) {
			if (req.nextUrl.pathname.startsWith("/auth")) {
				const redirUrl = req.nextUrl.clone();
				redirUrl.pathname = req.nextUrl.searchParams.get("next") ?? "/";
				redirUrl.searchParams.delete("next");
				return NextResponse.redirect(redirUrl, { status: 302 });
			}
		} else {
			const isAuthPath = req.nextUrl.pathname.startsWith("/auth");
			const isAdminPath =
				req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin");

			if (!isAuthPath || (isAdminPath && session?.user?.role !== "admin")) {
				const redirUrl = req.nextUrl.clone();
				redirUrl.searchParams.set("next", req.nextUrl.pathname);
				redirUrl.pathname = "/auth/login";
				const resp = NextResponse.redirect(redirUrl, { status: 302 });
				if (isAdminPath) {
					resp.cookies.delete(cookieName);
				}
				return resp;
			}
		}
		return NextResponse.next();
	} catch (error) {
		console.error("authorized error", error);
		return new NextResponse(
			`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Server Error</title><style>body {display: flex;justify-content: center;align-items: center;height: 100vh;margin: 0;font-family: Arial, sans-serif;background-color: #f2f2f2;color: #333;}.container {text-align: center;padding: 20px;border: 1px solid #ccc;background: white;border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}h1 {font-size: 24px;margin-bottom: 10px;}p {margin: 0 0 20px;}a {text-decoration: none;color: #007BFF;}a:hover {text-decoration: underline;}</style></head><body><div class="container"><h1>ERROR: Something Went Wrong</h1><p>We're experiencing some technical difficulties.<br/> Please check the server status or logs for more information.</p><a href="/">Return to Home</a></div></body></html>`,
			{ status: 500, headers: { "Content-Type": "text/html" } },
		);
	}
}

export const config: MiddlewareConfig = {
	matcher: [
		"/admin/:path*",
		"/dashboard",
		"/auth/login",
		"/cart",
		"/api/admin/:path*",
		"/dashboard",
		"/customize/:path*",
		"/orders/:path*",
		"/api/cart/:path*",
		"/api/user/:path*",
	],
};
