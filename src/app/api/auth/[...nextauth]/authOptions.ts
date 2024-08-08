import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined");
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    debug: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    session: {
        strategy: "database",
        maxAge: 0.5 * 24 * 60 * 60, // 1/2 day
    },
    callbacks: {
        // @ts-ignore
        async signIn({ account }) {
            if (account?.provider === "google") {
                return true;
            }
            return false;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token = { ...token, ...user };
            }
            return token;
        },
        session: async ({ session, token, user }) => {
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
