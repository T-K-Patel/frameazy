"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { PaymentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay key and secret not found");
}
async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}

async function updateOrderStatus(orderId: string, status: PaymentStatus) {
    await db.order.update({
        where: {
            id: orderId,
        },
        data: {
            transaction_status: status,
        },
    });
}


async function updateTransactionStatus(transactionId: string, status: PaymentStatus, payId?: string) {
    const data: { status: PaymentStatus, paymentId?: string } = { status };
    if (payId) {
        data.paymentId = payId;
    }
    await db.transaction.update({
        where: {
            id: transactionId,
        },
        data
    });
}

const rzpInstance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }); // TODO: Replace with your key and secret

type InitiatePaymentForOrderReturnType = {
    orderId: string;
    transactionId: string;
    paymentOrderId: string;
    amount: number;
};

export async function initiatePaymentForOrder(orderId: string): Promise<ServerActionReturnType<InitiatePaymentForOrderReturnType>> {
    try {
        const userId = await isAuthenticated();
        const order = await db.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                transactions: {
                    where: {
                        status: { in: ["Pending", "Processing"] },
                    },
                    select: {
                        id: true,
                        paymentId: true,
                        paymentOrderId: true,
                        status: true,
                    },
                },
            },
        });
        if (!order) {
            throw new CustomError("Order not found");
        }
        console.log("Order found")
        switch (order.order_status) {
            case "Canceled":
                throw new CustomError("Order has been canceled");
            case "Delivered":
                throw new CustomError("Order has been delivered");
            case "Rejected":
                throw new CustomError("Order has been rejected");
            case "Shipped":
                throw new CustomError("Order has been shipped");
            case "Processing":
                throw new CustomError("Order is being processed");
            case "Received":
                throw new CustomError("Order is not approved yet");
            default:
                break;
        }
        if (order.transaction_status == "Success") {
            throw new CustomError("Already paid for an order");
        }
        if (order.transaction_status == "Processing") {
            throw new CustomError("Payment is being processed");
        }
        console.log("Order approved")
        const orderAmount = (order.delivery_charge + order.packaging - order.discount); // Amount in paise

        if (order.transactions.length > 0) {
            console.log("Transaction found")
            const transaction = order.transactions[0];
            const rzpOrderStatus = await rzpInstance.orders.fetch(order.paymentOrderId!);
            const payments = (await rzpInstance.orders.fetchPayments(order.paymentOrderId!)).items.sort(
                (a, b) => a.created_at - b.created_at,
            );
            if (rzpOrderStatus.status == "paid") {
                console.log("Order paid")
                await updateOrderStatus(orderId, "Success");
                const pId = payments.find((payment) => payment.status == "captured")?.id || "";
                await updateTransactionStatus(transaction.id, "Success", pId);

                throw new CustomError("Already paid for an order");
            } else if (rzpOrderStatus.status == "attempted") {
                console.log("Order attempted")
                if (payments.some((p) => p.status == "authorized")) {
                    await updateOrderStatus(orderId, "Processing");
                    await updateTransactionStatus(transaction.id, "Processing", payments.findLast((p) => p.status == "authorized")?.id || undefined);

                    throw new CustomError("Payment is being processed");
                } else if (payments.some((p) => p.status == "created")) {
                    throw new CustomError("Payment Pending");
                } else {
                    await updateTransactionStatus(transaction.id, "Failed", payments[payments.length - 1].id);

                }
            } else {
                return {
                    success: true,
                    data: {
                        orderId,
                        transactionId: transaction.id,
                        paymentOrderId: order.paymentOrderId!,
                        amount: orderAmount,
                    },
                };
            }
        }
        console.log("No Transaction found")

        // Create an new order on payment gateway.

        const rzpOrder = await rzpInstance.orders.create({
            amount: orderAmount,
            currency: "INR",
            partial_payment: false,
        });
        const paymentOrderId = rzpOrder.id;

        console.log("Order created on Razorpay")

        // Create a new transaction
        const transaction = await db.transaction.create({
            data: {
                orderId,
                amount: orderAmount,
                currency: "INR",
                paymentOrderId,
                status: "Pending",
            },
        });

        console.log("Transaction created")

        // Update order
        await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                transaction_status: "Pending",
                paymentOrderId,
                transactions: {
                    connect: {
                        id: transaction.id,
                    },
                },
            },
        });

        console.log("Order updated")

        return {
            success: true,
            data: {
                orderId,
                transactionId: transaction.id,
                paymentOrderId,
                amount: orderAmount,
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

type VerifyPaymentReturnType = {
    orderId: string;
    transactionId: string;
    paymentId: string;
    paymentOrderId: string;
};

export async function verifyPayment(
    orderId: string,
    paymentOrderId: string,
    paymentId: string,
): Promise<ServerActionReturnType<VerifyPaymentReturnType>> {
    try {

        // TODO: Verify payment from Razorpay and update tables accordingly
        return { success: true, data: { orderId, transactionId: "", paymentId, paymentOrderId } };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("verifyPayment error", error);
        return { success: false, error: "Something went wrong" };
    }
}
