"use server";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { Message, Transaction, Subscription, Order, Category, Color, Collection, OrderStatus, Role } from "@prisma/client";
import { CloudinaryStorage } from "@/lib/Cloudinary.storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    if (session.user.role !== Role.admin) {
        throw new CustomError("You are not authorized to perform this action");
    }
    return;
}


export async function addProduct(state: any, formData: FormData) {
    try {
        await isAdmin();
        const productName = formData.get("productName") as string;
        const unitPrice = Number(formData.get("unitPrice"));
        const productImage = formData.get("productImage") as File;
        const borderImage = formData.get("borderImage") as File;
        const productCategory = formData.get("productCategory") as Category;
        const productColor = formData.get("productColor") as Color;
        const productCollection = formData.get("productCollection") as Collection;

        let productWidth: number | null = Number(formData.get("productWidth"));
        let productHeight: number | null = Number(formData.get("productHeight"));
        const borderWidth = Number(formData.get("borderWidth"));

        if (!productName || productName.length < 3) {
            throw new CustomError("Product Name must be larger than 3 characters.");
        }

        if (isNaN(unitPrice) || !isFinite(unitPrice) || unitPrice <= 0) {
            throw new CustomError("Product Price must be a number and Positive.");
        }

        if (!productImage || !(productImage.type).startsWith("image/")) {
            throw new CustomError("Product Image must be a valid image file (JPG, JPEG, PNG, GIF, AVIF).");
        }

        if (!borderImage || !(borderImage.type).startsWith("image/")) {
            throw new CustomError("Border Image must be a valid image file (JPEG, PNG, GIF).");
        }

        if (!Object.values(Category).includes(productCategory)) {
            throw new CustomError("Invalid Product Category.");
        }

        if (!Object.values(Color).includes(productColor)) {
            throw new CustomError("Invalid Product Category.");
        }

        if (!Object.values(Collection).includes(productCollection)) {
            throw new CustomError("Invalid Product Category.");
        }

        if (isNaN(productWidth)) productWidth = null;
        if (isNaN(productHeight)) productHeight = null;
        if (productWidth && (!isFinite(productWidth) || productWidth < 0)) {
            throw new CustomError("Product Width must be a positive number.");
        }

        if (productHeight && (!isFinite(productHeight) || productHeight < 0)) {
            throw new CustomError("Product Height must be a positive number and finite.");
        }

        if (!isFinite(borderWidth) || isNaN(borderWidth) || borderWidth <= 0) {
            throw new CustomError("Border Width must be a positive number and finite.");
        }



        const imageBuffer = await productImage.arrayBuffer();
        const imageUrl = await CloudinaryStorage.upload(imageBuffer);
        if (!imageUrl) {
            throw new CustomError("Failed to upload image");
        }
        const borderImageBuffer = await borderImage.arrayBuffer();
        const borderImageUrl = await CloudinaryStorage.upload(borderImageBuffer);
        if (!borderImageUrl) {
            throw new CustomError("Failed to upload image");
        }

        await db.frame.create({
            data: {
                name: productName,
                unit_price: unitPrice,
                image: imageUrl,
                category: productCategory,
                color: productColor,
                collection: productCollection,
                width: productWidth,
                height: productHeight,
                borderSrc: borderImageUrl,
                borderWidth: borderWidth,
            }
        });

        return { success: true, data: "Product added successfully" };

    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getMessagesAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
// LATER: Add pagination
export async function getMessagesAction(): Promise<ServerActionReturnType<Message[]>> {
    try {
        await isAdmin();
        const contacts = await db.message.findMany();

        return { success: true, data: contacts };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getMessagesAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

// LATER: Add pagination
export async function getTransactionsAction(): Promise<ServerActionReturnType<Transaction[]>> {
    try {
        await isAdmin();
        const transactions = await db.transaction.findMany();

        return { success: true, data: transactions };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getTransactionsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}


// LATER: Add pagination
export async function getSubscriptionsAction(): Promise<ServerActionReturnType<Subscription[]>> {
    try {
        await isAdmin();
        const subscriptions = await db.subscription.findMany();

        return { success: true, data: subscriptions };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getSubscriptionsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

// LATER: Add pagination
export async function getOrdersAction(): Promise<ServerActionReturnType<Order[]>> {
    try {
        await isAdmin();
        const orders = await db.order.findMany();

        return { success: true, data: orders };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getOrdersAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function getOrderDetailsAction(id: string): Promise<ServerActionReturnType<Order>> {
    try {
        await isAdmin();
        const order = await db.order.findFirst({
            where: {
                id
            },
            include: {
                order_items: true
            }
        });

        return { success: true, data: order! };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getOrderDetailsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus): Promise<ServerActionReturnType<boolean>> {
    try {
        await isAdmin();
        if (!(status in OrderStatus)) {
            throw new CustomError("Invalid status");
        }
        const prevStatus = await db.order.findFirst({ where: { id: orderId }, select: { order_status: true } }).then(order => order?.order_status);
        if (!prevStatus) {
            throw new CustomError("Order not found");
        }
        const orderStatus = Object.values(OrderStatus);
        if (orderStatus.indexOf(status) <= orderStatus.indexOf(prevStatus as OrderStatus)) {
            throw new CustomError("Invalid status");
        }
        const order = await db.order.update({
            where: {
                id: orderId
            },
            data: {
                order_status: status as OrderStatus
            }
        });

        if (order?.order_status !== status) {
            throw new CustomError("Failed to update order status");
        }
        return { success: true, data: true };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("updateOrderStatusAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
