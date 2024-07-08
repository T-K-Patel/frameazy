"use server";

import { CustomError } from "@/lib/CustomError";
import { db } from "../../prisma/db";

export async function subscribeNewsLetterAction(
    state: any,
    formData: FormData,
): Promise<{ data: string | null; error: string | null }> {
    try {
        const email = formData.get("email")?.toString();
        if (!email) throw new CustomError("Email is required");
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
            throw new CustomError("Invalid email address");

        if (await db.subscription.findFirst({ where: { email } }))
            throw new CustomError("You have already subscribed to our newsletter");

        const sub = await db.subscription.create({ data: { email } });
        if (!sub) throw new CustomError("Failed to subscribe to our newsletter");

        return { data: "You have successfully subscribed to our newsletter.", error: null };
    } catch (e: any) {
        if (!(e instanceof CustomError)) console.error(e);
        return {
            data: null,
            error: e instanceof CustomError ? e.message : "Something went wrong. Please try again later.",
        };
    }
}
