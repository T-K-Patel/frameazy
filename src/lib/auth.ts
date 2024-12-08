import NextAuth from "next-auth";
import { authOptions } from "./authOptions";
import { CustomError } from "@/lib/CustomError";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth(authOptions);

export async function isAuthenticated() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new CustomError("Unauthorized");
	}
	return session.user.id;
}

export async function isAdmin() {
	const session = await auth();
	if (!session?.user?.role || session.user.role !== "admin") {
		throw new CustomError("Unauthorized");
	}
	return session.user.id;
}
