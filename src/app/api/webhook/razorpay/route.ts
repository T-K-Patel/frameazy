import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentStatus, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

async function updateOrderStatus(order_id: string, type: "success" | "failed", payment_id: string) {
	type updateData = {
		order_status: OrderStatus;
		transaction: {
			update: {
				status: PaymentStatus;
				paymentId?: string;
			};
		};
	};
	const data: updateData = {
		order_status: type === "success" ? "Processing" : "Approved",
		transaction: {
			update: {
				status: type === "success" ? "Paid" : "Failed",
			},
		},
	};
	if (payment_id) {
		data.transaction.update.paymentId = payment_id;
	}

	await db.order.update({
		where: {
			id: order_id,
		},
		data: data,
	});
}

export async function POST(req: NextRequest) {
	const secret = RAZORPAY_WEBHOOK_SECRET;
	if (!secret) {
		return NextResponse.json({ message: "Razorpay secret not found" }, { status: 400 });
	}

	const body_data = await req.json();

	const shasum = crypto.createHmac("sha256", secret);
	shasum.update(JSON.stringify(body_data));
	const digest = shasum.digest("hex");

	const headers = req.headers;

	const signature = headers.get("x-razorpay-signature");

	if (!signature) {
		return NextResponse.json({ message: "Webhook signature not found" }, { status: 400 });
	}

	if (digest === signature) {
		// Handle the webhook event
		const event = body_data;

		if (event.event === "payment.captured") {
			const order_id = event.payload.payment.entity.order_id;

			// Update the order status in the database

			const fz_order = await db.order.findFirst({
				where: {
					transaction: {
						paymentOrderId: order_id,
					},
				},
			});

			if (fz_order && fz_order.order_status === "Approved") {
				await updateOrderStatus(fz_order.id, "success", event.payload.payment.entity.id);
				return NextResponse.json({ message: "Webhook accepted" }, { status: 200 });
			} else {
				return NextResponse.json({ message: "Order not found" }, { status: 404 });
			}
		} else if (event.event === "payment.failed") {
			const order_id = event.payload.payment.entity.order_id;

			// Update the order status in the database
			const fz_order = await db.order.findFirst({
				where: {
					transaction: {
						paymentOrderId: order_id,
					},
				},
			});

			if (fz_order && fz_order.order_status === "Approved") {
				await updateOrderStatus(fz_order.id, "failed", event.payload.payment.entity.id);
				return NextResponse.json({ message: "Webhook accepted" }, { status: 200 });
			} else {
				return NextResponse.json({ message: "Order not found" }, { status: 404 });
			}
		} else {
			return NextResponse.json({ message: "Webhook event not supported" }, { status: 400 });
		}
	} else {
		return NextResponse.json({ message: "Webhook signature mismatch" }, { status: 400 });
	}
}
