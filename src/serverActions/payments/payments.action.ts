// import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// import { CustomError } from "@/lib/CustomError";
// import { db } from "@/lib/db";
// import { ServerActionReturnType } from "@/types/serverActionReturnType";
// import { PaymentStatus } from "@prisma/client";
// import { getServerSession } from "next-auth";
// import Razorpay from "razorpay";

// async function isAuthenticated() {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//         throw new CustomError("Unauthorized");
//     }
//     return session.user.id;
// }

// async function updateOrderStatus(orderId: string, status: PaymentStatus) {
//     await db.order.update({
//         where: {
//             id: orderId
//         },
//         data: {
//             transaction_status: status
//         }
//     });
// }

// async function updateTransactionStatus(transactionId: string, status: PaymentStatus) {
//     await db.transaction.update({
//         where: {
//             id: transactionId
//         },
//         data: {
//             status
//         }
//     });
// }

// async function updateOrderAndTransactionStatus(orderId: string, transactionId: string, status: PaymentStatus) {
//     await updateOrderStatus(orderId, status);
//     await updateTransactionStatus(transactionId, status);
// }

// const rzpInstance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })

// type PayForOrderReturnType = {
//     orderId: string;
//     transactionId: string;
//     paymentOrderId: string;
// } | string;

// export async function payForAnOrder(orderId: string): Promise<ServerActionReturnType<PayForOrderReturnType>> {
//     try {
//         const userId = await isAuthenticated();
//         const order = await db.order.findFirst({
//             where: {
//                 id: orderId,
//                 userId,
//             },
//             include: {
//                 transactions: {
//                     where: {
//                         status: { in: ["Pending", "Processing"] }
//                     },
//                     select: {
//                         id: true,
//                         paymentId: true,
//                         paymentOrderId: true,
//                         status: true,
//                     }
//                 }
//             }
//         });
//         if (!order) {
//             throw new CustomError("Order not found");
//         }
//         if (order.order_status != "Approved") {
//             throw new CustomError("Order not approved");
//         }
//         if (order.transaction_status == "Success") {
//             throw new CustomError("Order already paid");
//         }
//         if (order.transaction_status == "Processing") {
//             throw new CustomError("Payment is being processed");
//         }
//         if (order.paymentOrderId && order.transactions.length > 0) {
//             // Mark transactions as Failed
//             const payments = await rzpInstance.orders.fetchPayments(order.paymentOrderId);
//             payments.items.forEach(async (payment) => {
//                 // TODO: update transaction status
//             });

//         }

//         // Create an new order on payment gateway.
//         const orderAmount = Math.ceil((order.delivery_charge + order.packaging - order.discount) * 100)

//         const rzpOrder = await rzpInstance.orders.create({
//             amount: orderAmount,
//             currency: "INR",
//             partial_payment: false,
//         })
//         const paymentId = "PAYMENT_ID" || rzpOrder.id;
//         const paymentOrderId = "PAYMENT_ORDER_ID";

//         // Create a new transaction
//         const transaction = await db.transaction.create({
//             data: {
//                 orderId,
//                 amount: orderAmount,
//                 currency: "INR",
//                 paymentId,
//                 paymentOrderId,
//             }
//         });

//         // Update order
//         await db.order.update({
//             where: {
//                 id: orderId
//             },
//             data: {
//                 transaction_status: "Pending",
//                 transactions: {
//                     connect: {
//                         id: transaction.id
//                     }
//                 }
//             }
//         });

//         return {
//             success: true, data: {
//                 orderId,
//                 transactionId: transaction.id,
//                 paymentOrderId,
//             }
//         };
//     } catch (error) {
//         if (error instanceof CustomError) {
//             return { success: false, error: error.message };
//         }
//         console.error("payForAnOrder error", error);
//         return { success: false, error: "Something went wrong" };
//     }
// }

// type VerifyPaymentReturnType = {
//     orderId: string;
//     transactionId: string;
//     paymentId: string;
//     paymentOrderId: string;
// };

// export async function verifyPayment(orderId: string, paymentOrderId: string, paymentId: string): Promise<ServerActionReturnType<VerifyPaymentReturnType>> {
//     try {
//         const userId = await isAuthenticated();

//         // Verify order belongs to user
//         const order = await db.order.findFirst({
//             where: {
//                 id: orderId,
//                 userId,
//             },
//             include: {
//                 transactions: {
//                     where: {
//                         status: "Pending"
//                     }
//                 }
//             }
//         });

//         if (!order) {
//             throw new CustomError("Order not found");
//         }

//         const rzpPayments = await rzpInstance.payments.fetch(paymentId);


//         if (rzpPayments.status == "authorized") {
//             if (order.transaction_status == "Pending") {
//                 await updateOrderStatus(orderId, "Processing");
//                 for (const transaction of order.transactions) {
//                     await updateTransactionStatus(transaction.id, transaction.paymentId == paymentId ? "Processing" : "Failed")
//                 }
//             }
//             throw new CustomError("Payment is being processed");
//         } else if (rzpPayments.status == "created") {
//             throw new CustomError("Payment Pending");
//         } else if (rzpPayments.status == "captured") {
//             await updateOrderStatus(orderId, "Success");
//             for (const transaction of order.transactions) {
//                 await updateTransactionStatus(transaction.id, transaction.paymentId == paymentId ? "Success" : "Failed")
//             }
//         }


//         const transaction = await db.transaction.findFirst({
//             where: {
//                 paymentOrderId,
//                 paymentId,
//                 status: "Pending",
//             },
//             include: {
//                 order: {
//                     select: {
//                         id: true,
//                         transaction_status: true,
//                     }
//                 }
//             }
//         });

//         console.log(transaction);

//         return { success: true, data: { orderId, transactionId: transaction?.id || "", paymentId, paymentOrderId } };

//     } catch (error) {
//         if (error instanceof CustomError) {
//             return { success: false, error: error.message };
//         }
//         console.error("verifyPayment error", error);
//         return { success: false, error: "Something went wrong" };
//     }
// }