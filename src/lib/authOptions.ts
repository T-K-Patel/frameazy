import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import crypto from "crypto";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

if (!process.env.NEXTAUTH_SECRET) {
	throw new Error("NEXTAUTH_SECRET is not defined");
}

export const authOptions: NextAuthConfig = {
	adapter: PrismaAdapter(db),
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],
	session: {
		strategy: "database",
		maxAge: 24 * 60 * 60, // 1 day
		generateSessionToken() {
			return crypto.randomBytes(32).toString("hex");
		},
	},
	callbacks: {
		async signIn({ account, user }) {
			if (user.email && user.email === process.env.ADMIN_EMAIL && user.role !== "admin") {
				await db.user.update({
					where: { id: user.id },
					data: { role: "admin" },
				});
			}
			if (account?.provider === "google") {
				return true;
			}
			return false;
		},
		jwt({ token, user }) {
			if (user) {
				token = { ...token, ...user };
			}
			return token;
		},
		session({ session, token, user }) {
			session.user = { ...token, ...user };
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/login",
		signOut: "/",
	},
};
