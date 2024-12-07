import { isAdmin } from "@/utils/auth";
import { OrderStatus } from "@prisma/client";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
	const formData = await req.formData();
	try {
		await isAdmin();
		const orderId = formData.get("orderId") as string;
		const status: OrderStatus = formData.get("status") as OrderStatus;
		if (!(status in OrderStatus)) {
			throw new CustomError("Invalid status");
		}
		if (status === OrderStatus.Canceled) {
			throw new CustomError("You can't cancel an order");
		}
		const prevStatus = await db.order
			.findFirst({ where: { id: orderId }, select: { order_status: true } })
			.then((order) => order?.order_status);
		if (!prevStatus) {
			throw new CustomError("Order not found");
		}
		const orderStatus = Object.values(OrderStatus);
		if (orderStatus.indexOf(status) <= orderStatus.indexOf(prevStatus as OrderStatus)) {
			throw new CustomError("Invalid status");
		}
		const order = await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				order_status: status as OrderStatus,
			},
		});

		if (order?.order_status !== status) {
			throw new CustomError("Failed to update order status");
		}
		return NextResponse.json({ status }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("updateOrderStatusAction error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
