"use server";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { OrderStatus, CartCustomization, Address, PaymentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { z } from "zod";
import { ObjectIdValidation } from "@/utils/validators";
import { getDeliveryCharge } from "@/utils/totalPrice";
async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}

export type UserOrders = {
    id: string;
    order_status: OrderStatus;
    createdAt: Date;
    delivery_date: Date | null;
    delivery_charge: number;
    packaging: number;
    discount: number;
    transaction: {
        status: string;
    } | null;
};

export async function getOrdersAction(): Promise<ServerActionReturnType<UserOrders[]>> {
    try {
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
            },
            orderBy: {
                createdAt: "desc",
            },
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
    id: string;
    order_items: {
        id: string;
        customization: CartCustomization;
        frame: {
            name: string;
            image: string;
        } | null;
        quantity: number;
        single_unit_price: number;
    }[];
    shipping_address: Address;
    order_status: OrderStatus;
    delivery_charge: number;
    createdAt: Date;
    packaging: number;
    discount: number;
    delivery_date: Date | null;
    transaction: {
        status: PaymentStatus;
    } | null;
};
export async function getOrderDetailsAction(id: string): Promise<ServerActionReturnType<UserOrderDetails>> {
    try {
        const userId = await isAuthenticated();
        ObjectIdValidation(id, "Invalid Order Id");
        const order = await db.order.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
                order_items: {
                    select: {
                        id: true,
                        customization: true,
                        frame: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                        quantity: true,
                        single_unit_price: true,
                    },
                },
                shipping_address: true,
                order_status: true,
                delivery_charge: true,
                packaging: true,
                discount: true,
                delivery_date: true,
                createdAt: true,
                transaction: {
                    select: {
                        status: true,
                    },
                },
            },
        });

        if (!order) throw new CustomError("Order Not found");

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
    name: z.string().min(3),
    addressL1: z.string().min(3),
    addressL2: z.string().min(3),
    city: z.string().min(3),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
    state: z.string().min(3),
    phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
});

export async function placeOrderAction(state: any, formData: FormData): Promise<ServerActionReturnType<string>> {
    try {
        const userId = await isAuthenticated();
        const address = {
            name: formData.get("name") as string,
            addressL1: formData.get("address-line-1") as string,
            addressL2: formData.get("address-line-2") as string,
            city: formData.get("city") as string,
            pincode: formData.get("pin-code") as string,
            state: formData.get("state") as string,
            phone: formData.get("phone") as string,
        };
        let cart = await db.cartItem.findMany({
            where: {
                userId,
            },
        });
        console.log("h1");
        if (cart.length == 0) {
            console.log("h2");
            throw new CustomError("Cart is empty");
        }

        const addressValidate = AddressSchema.safeParse(address);
        if (!addressValidate.success) {
            console.log(addressValidate.error.format());
            throw new CustomError("Address not in proper format");
        }
        const packaging = cart.reduce((acc, item) => acc + item.quantity * item.single_unit_price, 0);
        const delivery_charge = getDeliveryCharge(packaging);
        const orderId = await db
            .$transaction(async (transaction) => {
                const order = await transaction.order.create({
                    data: {
                        userId,
                        shipping_address: address,
                        delivery_charge,
                        packaging,
                        delivery_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                    },
                });

                cart.forEach(async (item) => {
                    const cutomization = await transaction.cartCustomization.findUnique({
                        where: {
                            id: item.customizationId,
                        },
                    });

                    if (cutomization) {
                        await transaction.orderCustomization.create({
                            data: cutomization,
                        });
                    } else {
                        throw new CustomError("Customization not found");
                    }
                    await transaction.cartCustomization.delete({
                        where: {
                            id: cutomization?.id,
                        },
                    });
                });

                const orderItemsArr = cart.map((item) => ({
                    orderId: order.id,
                    customizationId: item.customizationId,
                    quantity: item.quantity,
                    single_unit_price: item.single_unit_price,
                    frameId: item.frameId,
                }));

                await transaction.orderItem.createMany({
                    data: orderItemsArr,
                });

                await transaction.cartItem.deleteMany({
                    where: {
                        userId: userId,
                    },
                });
                return order.id;
            })
            .catch(() => {
                throw new CustomError("Failed to place order");
            });
        if (!orderId) throw new CustomError("Failed to place order");
        return { success: true, data: orderId };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("placeOrderAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function cancelOrderAction(id: string): Promise<ServerActionReturnType<string>> {
    try {
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
                        status: true
                    }
                }
            }
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
        return { success: true, data: "Order cancelled successfully" };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("cancelOrderAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
