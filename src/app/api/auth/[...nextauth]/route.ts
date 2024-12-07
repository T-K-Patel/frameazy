"use server";
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => (await NextAuth(authOptions)(req)) as Promise<NextResponse>;

export { handler as GET, handler as POST };
