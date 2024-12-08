"use server";
import { auth } from "@/lib/auth";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { ObjectIdValidation } from "@/utils/validators";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import Razorpay from "razorpay";

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
	throw new Error("Razorpay key and secret not found");
}
async function isAuthenticated() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new CustomError("Unauthorized");
	}
	return session.user.id;
}

async function isAuthUserAdmin() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new CustomError("Unauthorized");
	}
	return session.user.role == "admin";
}

async function updateOrderStatus(orderId: string, status: OrderStatus) {
	await db.order.update({
		where: {
			id: orderId,
		},
		data: {
			order_status: status,
		},
	});
}

async function updateTransactionStatus(transactionId: string, status: PaymentStatus, payId?: string) {
	const data: { status: PaymentStatus; paymentId?: string } = { status };
	if (payId) {
		data.paymentId = payId;
	}
	await db.transaction.update({
		where: {
			id: transactionId,
		},
		data,
	});
}

const rzpInstance = new Razorpay({
	key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

type InitiatePaymentForOrderReturnType = {
	orderId: string;
	transactionId: string;
	paymentOrderId: string;
	amount: number;
	currency: string;
};

export async function initiatePaymentForOrder(
	orderId: string,
): Promise<ServerActionReturnType<InitiatePaymentForOrderReturnType>> {
	try {
		const userId = await isAuthenticated();
		const order = await db.order.findFirst({
			where: {
				id: orderId,
				userId,
			},
			include: {
				transaction: {
					select: {
						id: true,
						paymentId: true,
						paymentOrderId: true,
						status: true,
						amount: true,
						currency: true,
					},
				},
			},
		});
		if (!order) {
			throw new CustomError("Order not found");
		}
		console.log("Order found");
		if (order.order_status == "Received") {
			throw new CustomError("Order is not approved yet");
		}
		if (order.order_status != "Approved") {
			throw new CustomError("Payment can't be initiated for this order");
		}

		console.log("Order approved");
		if (order.transaction) {
			console.log("Transaction found");
			if (order.transaction.status == "Paid") {
				throw new CustomError("Already paid for an order");
			}
			console.log("Transaction not paid");
			const rzpOrderId = order.transaction.paymentOrderId;
			const rzpOrderStatus = await rzpInstance.orders.fetch(rzpOrderId);
			const payments = (await rzpInstance.orders.fetchPayments(rzpOrderId)).items;
			if (rzpOrderStatus.status == "paid") {
				console.log("Payment Order paid");
				// TODO: Update order status to Processing
				await updateOrderStatus(orderId, "Processing");
				const paymentId = payments.find((payment) => payment.status == "captured")?.id;
				await updateTransactionStatus(order.transaction.id, "Paid", paymentId);
				throw new CustomError("Already paid for an order");
			} else if (rzpOrderStatus.status == "attempted") {
				console.log("Payment Order attempted");
				if (order.transaction.status != "Attempted") {
					await updateTransactionStatus(order.transaction.id, "Attempted");
				}
				if (payments.some((p) => p.status == "authorized")) {
					console.log("Payment Order authorized");
					throw new CustomError("Payment is being processed");
				}
			}
			console.log("Payment Order not authorized");
			return {
				success: true,
				data: {
					orderId,
					transactionId: order.transaction.id,
					paymentOrderId: rzpOrderId,
					amount: order.transaction.amount,
					currency: order.transaction.currency,
				},
			};
		}
		console.log("No Transaction found");
		const orderAmount = order.delivery_charge + order.packaging - order.discount; // Amount in paise

		// Create an new order on payment gateway.

		const rzpOrder = await rzpInstance.orders.create({
			amount: orderAmount,
			currency: "INR",
			partial_payment: false,
		});
		const paymentOrderId = rzpOrder.id;

		console.log("Order created on Razorpay");

		// Create a new transaction
		const transaction = await db.transaction.create({
			data: {
				orderId,
				amount: orderAmount,
				currency: rzpOrder.currency,
				paymentOrderId,
			},
		});

		console.log("Transaction created");

		// Update order
		await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				transaction: {
					connect: {
						id: transaction.id,
					},
				},
			},
		});

		console.log("Order updated");

		return {
			success: true,
			data: {
				orderId,
				transactionId: transaction.id,
				paymentOrderId,
				amount: orderAmount,
				currency: transaction.currency,
			},
		};
	} catch (error) {
		if (error instanceof CustomError) {
			return { success: false, error: error.message };
		}
		console.error("initiatePaymentForOrder error", error);
		return { success: false, error: "Something went wrong" };
	}
}

export async function checkPaymentStatus(orderId: string): Promise<ServerActionReturnType<boolean>> {
	try {
		const userId = await isAuthenticated();
		ObjectIdValidation(orderId);
		const isAdmin = await isAuthUserAdmin();
		const query = isAdmin ? { id: orderId } : { id: orderId, userId };
		const order = await db.order.findFirst({
			where: query,
			include: {
				transaction: {
					select: {
						id: true,
						status: true,
						paymentOrderId: true,
					},
				},
			},
		});
		if (!order) {
			throw new CustomError("Order not found");
		}
		if (!order.transaction) {
			throw new CustomError("Transaction not found");
		}
		if (order.transaction.status == "Paid") {
			return { success: true, data: true };
		}
		const rzpOrder = await rzpInstance.orders.fetch(order.transaction.paymentOrderId);
		const payments = (await rzpInstance.orders.fetchPayments(order.transaction.paymentOrderId)).items;
		if (rzpOrder.status == "paid") {
			await updateOrderStatus(orderId, "Processing");
			const paymentId = payments.find((payment) => payment.status == "captured")?.id;
			await updateTransactionStatus(order.transaction.id, "Paid", paymentId);
			return { success: true, data: true };
		} else if (rzpOrder.status == "attempted") {
			if (order.transaction.status != "Attempted") {
				await updateTransactionStatus(order.transaction.id, "Attempted");
			}
		}
		return { success: true, data: false };
	} catch (error) {
		if (error instanceof CustomError) {
			return { success: false, error: error.message };
		}
		console.error("checkPaymentStatus error", error);
		return { success: false, error: "Something went wrong" };
	}
}
