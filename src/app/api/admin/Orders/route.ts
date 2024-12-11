import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { AdminOrdersType } from "./response";

export async function GET(): Promise<NextResponse<AdminOrdersType[] | { success: false; error: string }>> {
	try {
		await isAdmin();
		const orders = await db.order.findMany({
			select: {
				id: true,
				order_status: true,
				createdAt: true,
				delivery_charge: true,
				packaging: true,
				discount: true,
				delivery_date: true,
				transaction: {
					select: {
						status: true,
					},
				},
				user: {
					select: {
						name: true,
					},
				},
				_count: {
					select: {
						order_items: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		console.log(orders);
		return NextResponse.json<AdminOrdersType[]>(orders, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getOrdersAction error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
