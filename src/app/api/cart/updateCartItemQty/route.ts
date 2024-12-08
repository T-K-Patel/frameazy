import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
	const body = await req.json();
	const itemId = body.itemId;
	let qty = body.qty;
	try {
		const userId = await isAuthenticated();
		qty = Number(qty);
		if (isNaN(qty) || qty < 1 || !Number.isInteger(qty)) throw new CustomError("Quantity must be at least 1");
		const updatedItem = await db.cartItem.update({
			where: {
				id: itemId,
				userId,
			},
			data: {
				quantity: qty,
			},
		});
		if (!updatedItem) throw new CustomError("Item not found in cart");
		return NextResponse.json({ data: qty }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("updateCartItemQty error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
