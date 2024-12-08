import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
	const { itemId } = await req.json();
	try {
		const userId = await isAuthenticated();

		// TODO: delete customization also
		const deletedItem = await db.cartItem.delete({ where: { id: itemId, userId } });

		if (!deletedItem) throw new CustomError("Item not found in cart");
		return NextResponse.json({ data: "Item deleted from cart" }, { status: 200 });
	} catch (error: any) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("deleteCartItem error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
