"use server";

import { CustomError } from "@/lib/CustomError";
import { db } from "../lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { validateEmail } from "../utils/validators";
import { randomBytes } from "crypto";

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

		const unsubscribeToken = randomBytes(32).toString("hex");
		const sub = await db.subscription.create({ data: { email, unsubscribeToken } });
		if (!sub) throw new CustomError("Failed to subscribe to our newsletter");

		return { data: "You have successfully subscribed to our newsletter.", success: true };
	} catch (error: any) {
		if (error instanceof CustomError) {
			return { success: false, error: error.message };
		}
		console.error("subscribeNewsLetterAction error", error);
		return { success: false, error: "Something went wrong" };
	}
}

export async function unsubscribeNewsLetterAction(token: string): Promise<ServerActionReturnType<string>> {
	try {
		const deleteedSub = await db.subscription.delete({ where: { unsubscribeToken: token } });

		if (!deleteedSub) throw new CustomError("Invalid token");

		return { success: true, data: "You have successfully unsubscribed from our newsletter." };
	} catch (error: any) {
		if (error instanceof CustomError) {
			return { success: false, error: error.message };
		}
		console.error("unsubscribeNewsLetterAction error", error);
		return { success: false, error: "Something went wrong" };
	}
}
