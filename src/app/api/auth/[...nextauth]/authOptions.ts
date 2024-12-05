import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import crypto from "node:crypto";

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined");
}
const db = new PrismaClient();

export const authOptions: NextAuthOptions = {
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
        signIn({ account }) {
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
