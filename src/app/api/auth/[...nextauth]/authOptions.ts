import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/../prisma/db";
import * as bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined");
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    debug: process.env.NODE_ENV === "development",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "sample@mail.com", required: true },
                password: { label: "Password", type: "password", required: true },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<any> {
                if (!credentials?.password) return null;
                const existingUser = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!existingUser) throw new Error("User with given credentials not found");
                if (!existingUser.password)
                    throw new Error(
                        "You are not allowed to login to this account with password. Please use Google Sign In.",
                    );
                if (!existingUser.emailVerified) throw new Error("Email not verified. Please verify your email first.");

                if (await bcrypt.compare(credentials.password, existingUser.password)) {
                    return existingUser;
                }
                throw new Error("User with given credentials not found");
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    callbacks: {
        // @ts-ignore
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn Callback: ", { user, account, profile, email, credentials });
            if (account?.provider === "google") {
                return profile?.email_verified;
            }
            if (account?.provider === "credentials") {
                return user?.emailVerified;
            }
            return true; // Do different verification for other providers that don't have `email_verified`
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        signOut: "/",
    },
};
