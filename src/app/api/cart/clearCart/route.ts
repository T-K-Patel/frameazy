import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE() {
	try {
		const userId = await isAuthenticated();

		// TODO: delete customization also
		await db.cartItem.deleteMany({ where: { userId: userId } });
		return NextResponse.json({ data: "Cart cleared" }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("clearCartAction error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
