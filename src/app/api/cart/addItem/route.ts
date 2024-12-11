import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateCustomization } from "./validators";

/**
 *
 * Data required in body:
 *
 * {
 * 	type: CustomizationType,
 * 	glazing: string,
 * 	mirror: string,
 * 	backing: string,
 * 	printing: string,
 * 	sides: string,
 * 	stretching: string,
 * 	image: string,
 * 	externalImage: boolean,
 * 	width: number,
 * 	height: number,
 * 	mat: Array<{ color: string, width: number }>,
 * 	frameId: string,
 * 	frameBorderWidth: number,
 * 	qty: number
 * }
 */
export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		const userId = await isAuthenticated();

		const { cartCustomization, priceInPaisa, frame, qty } = await validateCustomization(body);

		const cartItem = await db.$transaction(async (txn) => {
			const custId = await txn.cartCustomization
				.create({
					data: cartCustomization,
				})
				.then((data) => data.id);

			const cartItem = await txn.cartItem.create({
				data: {
					userId,
					customizationId: custId,
					frameId: frame?.id || undefined,
					single_unit_price: priceInPaisa,
					quantity: qty,
				},
			});

			return cartItem;
		});

		if (cartItem === null) {
			throw new CustomError("Failed to add item to cart");
		}

		return NextResponse.json({ data: cartItem.id }, { status: 200 });
	} catch (error) {
		console.log(error);
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("addCartItem error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
