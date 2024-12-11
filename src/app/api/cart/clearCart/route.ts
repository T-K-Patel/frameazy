import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE() {
	try {
		const userId = await isAuthenticated();

		const deletedCount = await db.$transaction(async (txn) => {
			const { count: customizationCount } = await txn.cartCustomization.deleteMany({
				where: {
					CartItem: {
						userId: userId,
					},
				},
			});
			const { count: itemCount } = await txn.cartItem.deleteMany({
				where: {
					userId: userId,
				},
			});

			if (customizationCount !== itemCount) {
				throw new CustomError("Error clearing cart");
			}
			return itemCount;
		});

		return NextResponse.json({ data: "Cart cleared", deletedCount }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("clearCartAction error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
