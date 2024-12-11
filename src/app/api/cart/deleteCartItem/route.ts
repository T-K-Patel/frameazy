import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
	const { itemId } = await req.json();
	try {
		const userId = await isAuthenticated();

		const deleted = await db.$transaction(async (txn) => {
			await txn.cartCustomization.deleteMany({
				where: {
					CartItem: {
						userId,
						id: itemId,
					},
				},
			});
			const deletedItem = await txn.cartItem.delete({
				where: {
					id: itemId,
					userId,
				},
			});

			if (!deletedItem) {
				throw new CustomError("Item not found in cart");
			}
			return deletedItem;
		});
		if (!deleted) throw new CustomError("Item not found in cart");
		return NextResponse.json({ data: "Item deleted from cart" }, { status: 200 });
	} catch (error: any) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("deleteCartItem error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
