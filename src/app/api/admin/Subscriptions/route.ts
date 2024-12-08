import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function GET() {
	try {
		await isAdmin();
		const subscriptions = await db.subscription.findMany({
			select: {
				id: true,
				email: true,
				status: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return NextResponse.json(subscriptions, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getSubscriptionsAction error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
