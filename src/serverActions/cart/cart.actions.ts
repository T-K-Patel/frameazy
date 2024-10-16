"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { getServerSession } from "next-auth";
import { CartCustomization } from "@prisma/client";

async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}
export type CartItemType = {
    id: string;
    customization: CartCustomization;
    quantity: number;
    frame: {
        image: string;
        name: string;
    } | null;
    single_unit_price: number;
};

export async function getCartItems(): Promise<ServerActionReturnType<CartItemType[]>> {
    try {
        const userId = await isAuthenticated();
        const cartItems = await db.cartItem.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                customization: true,
                quantity: true,
                single_unit_price: true,
                frame: {
                    select: {
                        image: true,
                        name: true,
                    },
                },
            },
        });

        return { success: true, data: cartItems };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getCartItems error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function updateCartItemQty(qty: number, itemId: string): Promise<ServerActionReturnType<number>> {
    try {
        const userId = await isAuthenticated();
        qty = Number(qty);
        if (isNaN(qty) || qty < 1 || !Number.isInteger(qty)) throw new CustomError("Quantity must be at least 1");
        const updatedItem = await db.cartItem.update({
            where: {
                id: itemId,
                userId,
            },
            data: {
                quantity: qty,
            },
        });
        if (!updatedItem) throw new CustomError("Item not found in cart");
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
        const userId = await isAuthenticated();

        // TODO: delete customization also
        const deletedItem = await db.cartItem.delete({ where: { id: itemId, userId } });

        if (!deletedItem) throw new CustomError("Item not found in cart");
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
        const userId = await isAuthenticated();

        // TODO: delete customization also
        await db.cartItem.deleteMany({ where: { userId: userId } });
        return { success: true, data: "Cart cleared" };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("clearCartAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
