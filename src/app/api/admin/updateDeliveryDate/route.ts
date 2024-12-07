import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { isAdmin } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
	const formData = await req.formData();
	try {
		await isAdmin();
		const orderId = formData.get("orderId") as string;
		const deliveryDate = formData.get("deliveryDate") as string;
		if (!deliveryDate) {
			throw new CustomError("Delivery Date is required");
		}
		let parsedDeliveryDate: Date | null = null;
		try {
			parsedDeliveryDate = new Date(deliveryDate);
			if (isNaN(parsedDeliveryDate.getTime())) {
				throw new CustomError("Invalid delivery date");
			}
			if (parsedDeliveryDate.getTime() < new Date().getTime()) {
				throw new CustomError("Invalid delivery date");
			}
		} catch {
			throw new CustomError("Invalid delivery date");
		}
		const order = await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				delivery_date: parsedDeliveryDate,
			},
			select: {
				delivery_date: true,
			},
		});

		if (!order) {
			throw new CustomError("Failed to update delivery date");
		}
		if (!order.delivery_date) {
			throw new CustomError("Failed to update delivery date");
		}

		return NextResponse.json({ deliveryDate: order.delivery_date }, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("updateDeliveryDate error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
