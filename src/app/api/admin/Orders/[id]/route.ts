import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { AdminOrderDetailsType } from "./response.d";
export async function GET(
	req: NextRequest,
	{ params: _params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<AdminOrderDetailsType | { success: false; error: string }>> {
	const params = await _params;
	const id = params.id;
	try {
		const regex = /^[0-9a-fA-F]{24}$/;
		if (!regex.test(id)) {
			throw new CustomError("Invalid order ID");
		}
		await isAdmin();
		const order = await db.order.findFirst({
			where: {
				id,
			},
			select: {
				id: true,
				order_status: true,
				createdAt: true,
				delivery_charge: true,
				packaging: true,
				discount: true,
				delivery_date: true,
				shipping_address: true,
				order_items: {
					select: {
						id: true,
						frame: {
							select: {
								name: true,
								image: true,
							},
						},
						quantity: true,
						customization: true,
						single_unit_price: true,
					},
				},
				user: {
					select: {
						name: true,
						email: true,
					},
				},
				transaction: {
					select: {
						status: true,
					},
				},
			},
		});

		if (!order) {
			throw new CustomError("Order not found");
		}

		return NextResponse.json(order, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getOrderDetailsAction error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
