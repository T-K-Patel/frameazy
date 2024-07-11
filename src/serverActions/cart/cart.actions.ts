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
    frame?: {
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

        if (cart) return { success: true, data: cart };

        cart = await db.user
            .findUnique({
                where: {
                    id: user.user.id
                },
                select: {
                    CartItem: {
                        select: {
                            id: true,
                            image: true,
                            quantity: true,
                            frame: true
                        }
                    }
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

export async function addCartItem(): Promise<ServerActionReturnType<string>> {
    try {
        const user = await getServerSession(authOptions);

        if (!user?.user.id) throw new CustomError("You need to be logged in to add to cart");

        let cart = await redisClient
            .get(`user:cart:${user.user.id}`)
            .then((res) => (res ? (JSON.parse(res) as CartItemType[]) : null));

        const exists =
            cart?.some((c) => {
                c.frameId == "668d2ffc8482cf9a0fd4d843";
            }) ||
            (await db.cartItem.findUnique({
                where: {
                    userId_frameId: {
                        userId: user.user.id,
                        frameId: "668d2ffc8482cf9a0fd4d843",
                    },
                },
            }));
        if (exists) {
            await db.cartItem.update({
                where: {
                    userId_frameId: {
                        userId: user.user.id,
                        frameId: "668d2ffc8482cf9a0fd4d843",
                    },
                },
                data: {
                    quantity: { increment: 1 },
                },
            });
            cart =
                cart?.map((c) => {
                    if (c.frameId == "668d2ffc8482cf9a0fd4d843") {
                        c.quantity += 1;
                    }
                    return c;
                }) || null;
            if (cart) {
                await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
            }
        } else {
            await db.cartItem.create({
                data: {
                    frameId: "668d2ffc8482cf9a0fd4d843",
                    image: "http://localhost:3000/frame-1.png",
                    quantity: 1,
                    userId: user.user.id,
                },
            });
            cart = await db.user
                .findUnique({ where: { id: user.user.id }, include: { CartItem: true } })
                .then((user) => user?.CartItem || null);
            if (cart) {
                await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
                await redisClient.expire(`user:cart:${user.user.id}`, 60 * 5); // 5 Minutes
            }
        }
        return { success: true, data: "Item added to cart" };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getCartItems error", error);
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
                .findUnique({ where: { id: user.user.id }, include: { CartItem: true } })
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
            console.error("updateCartItemQty error", error);
            return { success: false, error: error.message };
        }
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
                .then((user) => user?.CartItem || []))

        if (!cart) throw new CustomError("Item not found in cart");

        cart = cart.filter((item) => item.id !== itemId);

        const deletedItem = await db.cartItem.delete({ where: { id: itemId, userId: user.user.id } });

        if (!deletedItem) throw new CustomError("Item not found in cart");

        await redisClient.set(`user:cart:${user.user.id}`, JSON.stringify(cart));
        await redisClient.expire(`user:cart:${user.user.id}`, 60 * 15); // 15 Minutes

        return { success: true, data: "Item deleted from cart" };

    } catch (error: any) {
        if (error instanceof CustomError) {
            console.error("updateCartItemQty error", error);
            return { success: false, error: error.message };
        }
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
    const user = await getServerSession();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        return {
            success: true,
            data: { orderId: "123", orderTotal: 100, paymentIntentId: "123", paymentMethodId: "123" },
        };
    } catch (error) {
        console.error("placeOrderAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
