"use server";

import { getServerSession } from "next-auth";
import { db } from "../../prisma/db";
import { CustomError } from "@/lib/CustomError";

export async function contactUsAction(state: any, formData: FormData) {
    try {
        const session = await getServerSession();
        const name = formData.get("name")?.toString();
        const email = formData.get("email")?.toString();
        const message = formData.get("message")?.toString();

        if (!name || !email || !message) throw new CustomError("All fields are required");
        if (name.length > 100 || email.length > 100 || message.length > 1000) throw new CustomError("Too long input");
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new CustomError("Invalid email address");
        if (!name.match(/^[a-zA-Z\s]*$/)) throw new CustomError("Invalid name");
        let userId;
        if (session?.user && session.user.email?.toString()) {
            try {
                const user = await db.user.findUnique({
                    where: {
                        email: session.user.email.toString(),
                    },
                });
                if (user) userId = user.id;
            } catch {}
        }

        const success = await db.message.create({ data: { name, email, message, userId } });
        if (!success) throw new CustomError("Failed to send message");

        return { data: "Your message has been sent successfully. We will get back to you soon.", error: null };
    } catch (e: any) {
        if (!(e instanceof CustomError)) console.error(e);
        return {
            data: null,
            error: e instanceof CustomError ? e.message : "Something went wrong. Please try again later.",
        };
    }
}
