"use server"
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { OrderStatus, PaymentStatus, Customization, Address } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { z } from "zod";

async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}

export type UserOrders = {
    id: string,
    order_status: OrderStatus,
    createdAt: Date,
    transaction_status: PaymentStatus,
    delivery_date: Date
}

export async function getOrdersAction(): Promise<ServerActionReturnType<UserOrders[]>> {
    try {
        const userId = await isAuthenticated();
        const orders = await db.order.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                order_status: true,
                createdAt: true,
                transaction_status: true,
                delivery_date: true
            }
        });

        return { success: true, data: orders };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getOrdersAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export type UserOrderDetails = {
    id: string,
    order_items: {
        id: string,
        customization: Customization
    }[],
    shipping_address: Address,
    order_status: OrderStatus
}
export async function getOrderDetailsAction(id: string): Promise<ServerActionReturnType<UserOrderDetails>> {
    try {
        const userId = await isAuthenticated();
        const order = await db.order.findFirst({
            where: {
                id,
                userId
            },
            select: {
                id: true,
                order_items: {
                    select: {
                        id: true,
                        customization: true,
                    }
                },
                shipping_address: true,
                order_status: true
            },
        });

        if (!order) throw new CustomError("Item not found in cart");

        return { success: true, data: order };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getOrderDetailsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

const AddressSchema = z.object({
    name: z.string(),
    addressL1: z.string(),
    addressL2: z.string(),
    city: z.string(),
    pincode: z.string(),
    state: z.string(),
    phone: z.string()
})

export async function placeOrderAction(state: any, formData: FormData): Promise<ServerActionReturnType<string>> {
    try {
        const userId = await isAuthenticated();
        const address = {
            name: formData.get("name") as string,
            addressL1: formData.get("addressL1") as string,
            addressL2: formData.get("addressL2") as string,
            city: formData.get("city") as string,
            pincode: formData.get("pincode") as string,
            state: formData.get("state") as string,
            phone: formData.get("phone") as string
        };
        const delivery_charge = 30;  // NOTE: Hardcoded delivery charge
        const cart = await db.cartItem.findMany({
            where: {
                userId
            }
        });
        if (cart.length == 0) {
            throw new CustomError("Cart is empty");
        }

        const addressValidate = AddressSchema.safeParse(address);
        if (!addressValidate.success) {
            throw new CustomError("Address not in proper format");
        }
        const packaging = cart.reduce((acc, item) => acc + item.quantity * item.single_unit_price, 0);
        const orderId = await db.$transaction(async (transaction) => {
            const order = await transaction.order.create({
                data: {
                    userId,
                    shipping_address: address,
                    delivery_charge,
                    packaging,
                    delivery_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                }
            });

            const orderItemsArr = cart.map(item => ({
                orderId: order.id,
                customization: item.customization,
                quantity: item.quantity,
                single_unit_price: item.single_unit_price,
                frameId: item.frameId
            }));

            await transaction.orderItem.createMany({
                data: orderItemsArr
            });

            await transaction.cartItem.deleteMany({
                where: {
                    userId: userId
                }
            });
            return order.id;
        }).catch(() => {
            throw new CustomError("Failed to place order");
        });
        if (!orderId) throw new CustomError("Failed to place order");
        return { success: true, data: orderId }
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("placeOrderAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}