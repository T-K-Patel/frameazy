import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
	try {
		await isAdmin();
		const contacts = await db.message.findMany();

		return NextResponse.json(contacts, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getMessagesAction error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
