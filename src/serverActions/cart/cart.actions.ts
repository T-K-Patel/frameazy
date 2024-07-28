"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis.client";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { getServerSession } from "next-auth";

export type CartItemType = {
    id: string;
    frameId?: string;
    frame: {
        id: string;
        name: string;
        price: number;
        image: string;
        category: string;
        color: string;
        collection: string;
        width: number;
        height: number;
    };
    image: string;
    quantity: number;
};

export async function getCartItems(): Promise<ServerActionReturnType<CartItemType[]>> {
    try {
        const user = await getServerSession(authOptions);
        if (!user?.user.id) throw new CustomError("You need to be logged in to get cart items");

        let cart = await redisClient
            .get(`user:cart:${user.user.id}`)
            .then((res) => (res ? (JSON.parse(res) as CartItemType[]) : null));

        if (cart) {
            return { success: true, data: cart };
        }

        cart = await db.user
            .findUnique({
                where: {
                    id: user.user.id,
                },
                select: {
                    CartItem: {
                        select: {
                            id: true,
                            image: true,
                            quantity: true,
                            frame: true,
                            frameId: true,
                        },
                    },
                },
            })
            .then((user) => user?.CartItem || null);

        if (!cart) throw new CustomError("Cart not found");

        await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
        await redisClient.expire(`user:cart:${user.user.id}`, 60 * 5); // 5 Minutes

        return { success: true, data: cart };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getCartItems error", error);
        return { success: false, error: "Something went wrong" };
    }
}

type AddCartItemData = {
    frameId: string;
    image: string;
    quantity: number;
    userId: string;
};

export async function addCartItem(data: AddCartItemData): Promise<ServerActionReturnType<string>> {
    try {
        const user = await getServerSession(authOptions);

        if (!user?.user.id) throw new CustomError("You need to be logged in to add to cart");

        let cart = await redisClient
            .get(`user:cart:${user.user.id}`)
            .then((res) => (res ? (JSON.parse(res) as CartItemType[]) : null));

        const exists =
            cart?.some((c) => {
                c.frameId == data.frameId;
            }) ||
            (await db.cartItem.findUnique({
                where: {
                    userId_frameId: {
                        userId: user.user.id,
                        frameId: data.frameId,
                    },
                },
            }));
        if (exists) {
            await db.cartItem.update({
                where: {
                    userId_frameId: {
                        userId: user.user.id,
                        frameId: data.frameId,
                    },
                },
                data: {
                    quantity: { increment: 1 },
                },
            });
            cart =
                cart?.map((c) => {
                    if (c.frameId == data.frameId) {
                        c.quantity += 1;
                    }
                    return c;
                }) || null;
            if (cart) {
                await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
                await redisClient.expire(`user:cart:${user.user.id}`, 60 * 5); // 5 Minutes
            }
        } else {
            await db.cartItem.create({
                data: {
                    frameId: data.frameId,
                    image: "http://localhost:3000/frame-1.png",
                    quantity: 1,
                    userId: user.user.id,
                },
            });
            cart = await db.user
                .findUnique({
                    where: {
                        id: user.user.id,
                    },
                    select: {
                        CartItem: {
                            select: {
                                id: true,
                                image: true,
                                quantity: true,
                                frame: true,
                                frameId: true,
                            },
                        },
                    },
                })
                .then((user) => user?.CartItem || null);
            if (cart) {
                await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
                await redisClient.expire(`user:cart:${user.user.id}`, 60 * 5); // 5 Minutes
            }
        }
        return { success: true, data: "Item added to cart" };
    } catch (error) {
        console.log(error);
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("addCartItem error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function updateCartItemQty(
    qty: number,
    itemId: string,
    cartId: string,
): Promise<ServerActionReturnType<number>> {
    try {
        const user = await getServerSession(authOptions);
        if (!user?.user.id) throw new CustomError("You need to be logged in to update cart items");

        const cart =
            (await redisClient
                .get(`user:cart:${user.user.id}`)
                .then((res) => (res ? (JSON.parse(res) as CartItemType[]) : null))) ??
            (await db.user
                .findUnique({
                    where: {
                        id: user.user.id,
                    },
                    select: {
                        CartItem: {
                            select: {
                                id: true,
                                image: true,
                                quantity: true,
                                frame: true,
                                frameId: true,
                            },
                        },
                    },
                })
                .then((user) => user?.CartItem || null));

        if (!cart) throw new CustomError("Cart not found");

        const item = cart.find((item) => item.id === itemId);
        if (!item) throw new CustomError("Item not found in cart");

        if (!Number.isInteger(qty) || qty < 1) throw new CustomError("Quantity must be a positive integer");

        item.quantity = qty;
        await db.cartItem.update({ where: { id: item.id }, data: { quantity: qty } });

        await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
        await redisClient.expire(`user:cart:${user.user.id}`, 60 * 15); // 15 Minutes

        return { success: true, data: qty };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("updateCartItemQty error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function deleteCartItem(itemId: string): Promise<ServerActionReturnType<string>> {
    try {
        const user = await getServerSession(authOptions);
        if (!user?.user.id) throw new CustomError("You need to be logged in to delete cart items");

        let cart =
            (await redisClient
                .get(`user:cart:${user.user.id}`)
                .then((res) => (res ? (JSON.parse(res) as CartItemType[]) : []))) ??
            (await db.user
                .findUnique({ where: { id: user.user.id }, include: { CartItem: true } })
                .then((user) => user?.CartItem || []));

        if (!cart) throw new CustomError("Item not found in cart");

        cart = cart.filter((item) => item.id !== itemId);

        const deletedItem = await db.cartItem.delete({ where: { id: itemId, userId: user.user.id } });

        if (!deletedItem) throw new CustomError("Item not found in cart");

        await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
        await redisClient.expire(`user:cart:${user.user.id}`, 60 * 15); // 15 Minutes

        return { success: true, data: "Item deleted from cart" };
    } catch (error: any) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("deleteCartItem error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function clearCartAction(): Promise<ServerActionReturnType<string>> {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const user = await getServerSession(authOptions);
        if (!user?.user.id) throw new CustomError("You need to be logged in to clear cart items");

        await db.cartItem.deleteMany({ where: { userId: user.user.id } });
        await redisClient.del(`user:cart:${user.user.id}`);
        return { success: true, data: "Cart cleared" };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("clearCartAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

type PlaceOrderReturnType = {
    orderId: string;
    orderTotal: number;
    paymentIntentId: string;
    paymentMethodId: string;
};

export async function placeOrderAction(
    state: any,
    formData: FormData,
): Promise<ServerActionReturnType<PlaceOrderReturnType>> {
    // SECURITY: Validate that the user has permission to place the order
    try {
        const user = await getServerSession(authOptions);
        if (!user?.user.id) throw new CustomError("You need to be logged in to place an order");

        const name = formData.get("name") as string;
        const addressL1 = formData.get("address-line-1") as string;
        const addressL2 = formData.get("address-line-2") as string;
        const city = formData.get("city") as string;
        const pincode = formData.get("pin-code") as string;
        const state = formData.get("state") as string;
        const phone = formData.get("phone") as string;

        // IMPORTANT: Validate the form data here

        const cartItems = await db.cartItem.findMany({
            where: {
                userId: user.user.id,
            },
            include: {
                frame: { select: { price: true } },
            },
        });

        if (cartItems.length == 0) throw new CustomError("Cart is empty");

        const totalPrice = cartItems.reduce((acc, item) => acc + item.frame.price * item.quantity, 0); // TODO: Add shipping cost.

        const order = await db.order.create({
            data: {
                userId: user.user.id,
                price: totalPrice,
                name,
                addressL1,
                addressL2,
                city,
                pincode,
                state,
                phone,
            },
        });

        // Create orderItems for each cartItem
        await db.orderItem.createMany({
            data: cartItems.map((item) => ({
                orderId: order.id,
                image: item.image,
                frameId: item.frameId,
                quantity: item.quantity,
            })),
        });

        await db.cartItem.deleteMany({ where: { userId: user.user.id } });
        await redisClient.del(`user:cart:${user.user.id}`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            success: true,
            data: { orderId: order.id, orderTotal: totalPrice, paymentIntentId: "123", paymentMethodId: "123" },
        };
    } catch (error: any) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.log("placeOrderAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
