"use server";
import { db } from "../lib/db";
import { CustomError } from "@/lib/CustomError";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { auth } from "@/lib/auth";

export async function contactUsAction(state: any, formData: FormData): Promise<ServerActionReturnType<string>> {
	try {
		const session = await auth();
		const name = formData.get("name")?.toString();
		const email = formData.get("email")?.toString();
		const message = formData.get("message")?.toString();

		if (!name || !email || !message) throw new CustomError("All fields are required");
		if (name.length > 100 || email.length > 100 || message.length > 1000) throw new CustomError("Too long input");
		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
			throw new CustomError("Invalid email address");
		if (!name.match(/^[a-zA-Z\s]*$/)) throw new CustomError("Invalid name");
		const userId = session?.user?.id || null;

		const success = await db.message.create({ data: { name, email, message, userId } });
		if (!success) throw new CustomError("Failed to send message");

		return { data: "Your message has been sent successfully. We will get back to you soon.", success: true };
	} catch (error: any) {
		if (error instanceof CustomError) {
			return { success: false, error: error.message };
		}
		console.error("contactUsAction error", error);
		return { success: false, error: "Something went wrong" };
	}
}
