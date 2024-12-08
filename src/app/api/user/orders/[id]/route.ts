import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { ObjectIdValidation } from "@/utils/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params: _params }: { params: Promise<{ id: string }> }) {
	const params = await _params;
	const id = params.id;
	const userId = await isAuthenticated();
	try {
		ObjectIdValidation(id);
	} catch {
		return NextResponse.json({ error: "Invalid OrderId" }, { status: 500 });
	}
	const order = await db.order.findFirst({
		where: {
			id,
			userId,
		},
		select: {
			id: true,
			order_items: {
				select: {
					id: true,
					customization: true,
					frame: {
						select: {
							name: true,
							image: true,
						},
					},
					quantity: true,
					single_unit_price: true,
				},
			},
			shipping_address: true,
			order_status: true,
			delivery_charge: true,
			packaging: true,
			discount: true,
			delivery_date: true,
			createdAt: true,
			transaction: {
				select: {
					status: true,
				},
			},
		},
	});

	if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

	return NextResponse.json(order, { status: 200 });
}
