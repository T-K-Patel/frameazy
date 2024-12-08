import { isAuthenticated } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { ObjectIdValidation } from "@/utils/validators";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const userId = await isAuthenticated();
		ObjectIdValidation(id, "Invalid Order Id");
		const order = await db.order.findFirst({
			where: {
				id,
				userId,
			},
			include: {
				transaction: {
					select: {
						status: true,
					},
				},
			},
		});
		if (!order) throw new CustomError("Order not found");
		if (!([OrderStatus.Approved, OrderStatus.Received] as OrderStatus[]).includes(order.order_status))
			throw new CustomError("Order cannot be cancelled");
		if (order.transaction) {
			throw new CustomError("Order cannot be cancelled");
		}
		await db.order.update({
			where: {
				id,
			},
			data: {
				order_status: "Canceled",
			},
		});
		return NextResponse.json({ data: "Order cancelled successfully" }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("cancelOrderAction error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
