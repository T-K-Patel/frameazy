import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const userId = await isAuthenticated();
		const cartItems = await db.cartItem.findMany({
			where: {
				userId,
			},
			select: {
				id: true,
				customization: true,
				quantity: true,
				single_unit_price: true,
				frame: {
					select: {
						image: true,
						name: true,
					},
				},
			},
		});

		return NextResponse.json({ data: cartItems }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getCartItems error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
