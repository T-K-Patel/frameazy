import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { getDeliveryCharge } from "@/utils/totalPrice";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const AddressSchema = z.object({
	name: z.string().min(3),
	addressL1: z.string().min(3),
	addressL2: z.string().min(3),
	city: z.string().min(3),
	pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
	state: z.string().min(3),
	phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
});

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	try {
		const userId = await isAuthenticated();
		const address = {
			name: formData.get("name") as string,
			addressL1: formData.get("address-line-1") as string,
			addressL2: formData.get("address-line-2") as string,
			city: formData.get("city") as string,
			pincode: formData.get("pin-code") as string,
			state: formData.get("state") as string,
			phone: formData.get("phone") as string,
		};
		const cart = await db.cartItem.findMany({
			where: {
				userId,
			},
		});
		console.log("h1");
		if (cart.length == 0) {
			console.log("h2");
			throw new CustomError("Cart is empty");
		}

		const addressValidate = AddressSchema.safeParse(address);
		if (!addressValidate.success) {
			console.log(addressValidate.error.format());
			throw new CustomError("Address not in proper format");
		}
		const packaging = cart.reduce((acc, item) => acc + item.quantity * item.single_unit_price, 0);
		const delivery_charge = getDeliveryCharge(packaging);
		const orderId = await db
			.$transaction(async (transaction) => {
				const order = await transaction.order.create({
					data: {
						userId,
						shipping_address: address,
						delivery_charge,
						packaging,
						// delivery_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),  // TODO: Account for Delivery Date
					},
				});

				// VERIFY: This was the reason order were created without any orderitems
				await Promise.all(
					cart.map(async (item) => {
						const cutomization = await transaction.cartCustomization.findUnique({
							where: {
								id: item.customizationId,
							},
							select: {
								id: false,
								backing: true,
								glazing: true,
								sides: true,
								stretching: true,
								printing: true,
								height: true,
								width: true,
								image: true,
								mat: true,
								mirror: true,
								type: true,
							},
						});

						if (cutomization) {
							await transaction.orderCustomization.create({
								data: cutomization,
							});
						} else {
							throw new CustomError("Customization not found");
						}
						await transaction.cartCustomization.delete({
							where: {
								id: item.customizationId,
							},
						});
					}),
				);

				// TODO: If allowing frame edit option then check here for pricing update before placing order.

				const orderItemsArr = cart.map((item) => ({
					orderId: order.id,
					customizationId: item.customizationId,
					quantity: item.quantity,
					single_unit_price: item.single_unit_price,
					frameId: item.frameId,
				}));

				await transaction.orderItem.createMany({
					data: orderItemsArr,
				});

				await transaction.cartItem.deleteMany({
					where: {
						userId: userId,
					},
				});
				return order.id;
			})
			.catch((err: any) => {
				if (err instanceof CustomError) {
					throw err;
				}
				throw new CustomError("Failed to place order");
			});
		if (!orderId) throw new CustomError("Failed to place order");
		return NextResponse.json({ data: orderId }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("placeOrderAction error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
