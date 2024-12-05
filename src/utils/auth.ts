import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomError } from "@/lib/CustomError";
import { getServerSession } from "next-auth";

export async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}

export async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}
