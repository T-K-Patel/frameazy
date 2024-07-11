"use server";

import { CustomError } from "@/lib/CustomError";
import { db } from "../lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { validateEmail } from "./utils/validators";

export async function subscribeNewsLetterAction(
    state: any,
    formData: FormData,
): Promise<ServerActionReturnType<string>> {
    try {
        const email = formData.get("email")?.toString();
        if (!email) throw new CustomError("Email is required");
        const error = validateEmail(email);
        if (error) throw new CustomError(error);

        if (await db.subscription.findFirst({ where: { email } }))
            throw new CustomError("You have already subscribed to our newsletter");

        const sub = await db.subscription.create({ data: { email } });
        if (!sub) throw new CustomError("Failed to subscribe to our newsletter");

        return { data: "You have successfully subscribed to our newsletter.", success: true };
    } catch (e: any) {
        if (!(e instanceof CustomError)) console.error(e);
        return {
            success: false,
            error: e instanceof CustomError ? e.message : "Something went wrong. Please try again later.",
        };
    }
}
