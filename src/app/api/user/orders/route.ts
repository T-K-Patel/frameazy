import { db } from "@/lib/db";
import { isAuthenticated } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	let page = Number(req.nextUrl.searchParams.get("page") || 0);
	// validate page
	if (isNaN(page) || page < 0) {
		page = 0;
	}
	const userId = await isAuthenticated();
	const orders = await db.order.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			order_status: true,
			createdAt: true,
			delivery_date: true,
			delivery_charge: true,
			packaging: true,
			discount: true,
			transaction: {
				select: {
					status: true,
				},
			},
			_count: {
				select: {
					order_items: true,
				},
			},
		},
		take: 20,
		skip: page * 20,
		orderBy: {
			createdAt: "desc",
		},
	});

	const totalPages = await db.order.count({
		where: {
			userId,
		},
	});

	return NextResponse.json(
		{
			totalPages: Math.ceil(totalPages / 20),
			page,
			orders,
		},
		{ status: 200 },
	);
}
