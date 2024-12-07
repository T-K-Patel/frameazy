import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET() {
	try {
		const frames = await db.frame.findMany({
			where: {
				OrderItem: {
					some: {
						order: {
							order_status: {
								in: [
									OrderStatus.Approved,
									OrderStatus.Delivered,
									OrderStatus.Shipped,
									OrderStatus.Processing,
								],
							},
						},
					},
				},
			},
			orderBy: {
				OrderItem: {
					_count: "desc",
				},
			},
			take: 6,
			select: {
				id: true,
				name: true,
				varients: true,
				image: true,
			},
		});
		if (frames.length < 6) {
			const remainingFrames = await db.frame.findMany({
				where: {
					NOT: {
						id: {
							in: frames.map((frame) => frame.id),
						},
					},
				},
				take: 6 - frames.length,
				select: {
					id: true,
					name: true,
					varients: true,
					image: true,
				},
			});
			frames.push(...remainingFrames);
		}

		return NextResponse.json(frames, { status: 200 });
	} catch (error) {
		console.error("Error fetching frames:", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
