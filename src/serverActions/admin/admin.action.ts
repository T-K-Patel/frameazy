"use server";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { Message, Subscription, OrderStatus, Role, PaymentStatus, Address, CartCustomization } from "@prisma/client";
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
        const productCategory = formData.get("productCategory")?.toString().trim();
        const productColor = formData.get("productColor")?.toString().trim();
        const productCollection = formData.get("productCollection")?.toString().trim();

        const borderWidth = Number(formData.get("borderWidth"));

        if (!productName || productName.length < 3) {
            throw new CustomError("Product Name must be larger than 3 characters.");
        }

        if (isNaN(unitPrice) || !isFinite(unitPrice) || unitPrice <= 0) {
            throw new CustomError("Product Price must be a number and Positive.");
        }

        if (!productImage || !productImage.type.startsWith("image/")) {
            throw new CustomError("Product Image must be a valid image file (JPG, JPEG, PNG, GIF, AVIF).");
        }

        if (!borderImage || !borderImage.type.startsWith("image/")) {
            throw new CustomError("Border Image must be a valid image file (JPEG, PNG, GIF).");
        }

        if (!productCategory || productCategory.length < 3) {
            throw new CustomError("Product Category must be larger than 3 characters.");
        }

        if (!productCollection || productCollection.length < 3) {
            throw new CustomError("Product Collection must be larger than 3 characters.");
        }

        if (!productColor || productColor.length < 3) {
            throw new CustomError("Product Color must be larger than 3 characters.");
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
                unit_price: unitPrice * 100,
                image: imageUrl,
                category: productCategory.toLowerCase(),
                color: productColor.toLowerCase(),
                collection: productCollection.toLowerCase(),
                borderSrc: borderImageUrl,
                borderWidth: borderWidth,
            },
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

export type TransactionType = {
    id: string;
    orderId: string;
    paymentOrderId: string;
    paymentId: string | null;
    amount: number;
    status: PaymentStatus;
    updatedAt: Date;
};

// LATER: Add pagination
export async function getTransactionsAction(): Promise<ServerActionReturnType<TransactionType[]>> {
    try {
        await isAdmin();
        const transactions = await db.transaction.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                orderId: true,
                paymentOrderId: true,
                paymentId: true,
                updatedAt: true,
            },
        });

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
export async function getSubscriptionsAction(): Promise<
    ServerActionReturnType<Omit<Subscription, "unsubscribeToken">[]>
> {
    try {
        await isAdmin();
        const subscriptions = await db.subscription.findMany({
            select: {
                id: true,
                email: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return { success: true, data: subscriptions };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getSubscriptionsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export type AdminOrdersType = {
    id: string;
    order_status: OrderStatus;
    createdAt: Date;
    delivery_charge: number;
    packaging: number;
    discount: number;
    delivery_date: Date | null;
    transaction: {
        status: string;
    } | null;
};

// LATER: Add pagination
export async function getOrdersAction(): Promise<ServerActionReturnType<AdminOrdersType[]>> {
    try {
        await isAdmin();
        const orders = await db.order.findMany({
            select: {
                id: true,
                order_status: true,
                createdAt: true,
                delivery_charge: true,
                packaging: true,
                discount: true,
                delivery_date: true,
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

export type AdminOrderDetailsType = {
    id: string;
    order_status: OrderStatus;
    createdAt: Date;
    delivery_charge: number;
    packaging: number;
    discount: number;
    delivery_date: Date | null;
    shipping_address: Address;
    order_items: {
        id: string;
        frame: {
            name: string;
            image: string;
        } | null;
        quantity: number;
        customization: CartCustomization;
        single_unit_price: number;
    }[];
    user: {
        name: string | null;
        email: string | null;
    };
    transaction: {
        status: string;
    } | null;
};

export async function getOrderDetailsAction(id: string): Promise<ServerActionReturnType<AdminOrderDetailsType>> {
    try {
        const regex = /^[0-9a-fA-F]{24}$/;
        if (!regex.test(id)) {
            throw new CustomError("Invalid order ID");
        }
        await isAdmin();
        const order = await db.order.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                order_status: true,
                createdAt: true,
                delivery_charge: true,
                packaging: true,
                discount: true,
                delivery_date: true,
                shipping_address: true,
                order_items: {
                    select: {
                        id: true,
                        frame: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                        quantity: true,
                        customization: true,
                        single_unit_price: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                transaction: {
                    select: {
                        status: true,
                    },
                },
            },
        });

        if (!order) {
            throw new CustomError("Order not found");
        }

        return { success: true, data: order };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getOrderDetailsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function updateOrderStatusAction(
    state: any,
    formData: FormData,
): Promise<ServerActionReturnType<OrderStatus>> {
    try {
        await isAdmin();
        const orderId = formData.get("orderId") as string;
        const status: OrderStatus = formData.get("status") as OrderStatus;
        if (!(status in OrderStatus)) {
            throw new CustomError("Invalid status");
        }
        if (status === OrderStatus.Canceled) {
            throw new CustomError("You can't cancel an order");
        }
        const prevStatus = await db.order
            .findFirst({ where: { id: orderId }, select: { order_status: true } })
            .then((order) => order?.order_status);
        if (!prevStatus) {
            throw new CustomError("Order not found");
        }
        const orderStatus = Object.values(OrderStatus);
        if (orderStatus.indexOf(status) <= orderStatus.indexOf(prevStatus as OrderStatus)) {
            throw new CustomError("Invalid status");
        }
        const order = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                order_status: status as OrderStatus,
            },
        });

        if (order?.order_status !== status) {
            throw new CustomError("Failed to update order status");
        }
        return { success: true, data: status };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("updateOrderStatusAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function updateDeliveryDateAction(state: any, formData: FormData): Promise<ServerActionReturnType<Date>> {
    try {
        await isAdmin();
        const orderId = formData.get("orderId") as string;
        const deliveryDate = formData.get("deliveryDate") as string;
        if (!deliveryDate) {
            throw new CustomError("Delivery Date is required");
        }
        let parsedDeliveryDate: Date | null = null;
        try {
            parsedDeliveryDate = new Date(deliveryDate);
            if (isNaN(parsedDeliveryDate.getTime())) {
                throw new CustomError("Invalid delivery date");
            }
            if (parsedDeliveryDate.getTime() < new Date().getTime()) {
                throw new CustomError("Invalid delivery date");
            }
        } catch (error) {
            throw new CustomError("Invalid delivery date");
        }
        const order = await db.order.update({
            where: {
                id: orderId,
            },
            data: {
                delivery_date: parsedDeliveryDate,
            },
            select: {
                delivery_date: true,
            },
        });

        if (!order) {
            throw new CustomError("Failed to update delivery date");
        }
        if (!order.delivery_date) {
            throw new CustomError("Failed to update delivery date");
        }

        return { success: true, data: order.delivery_date };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("updateDeliveryDate error", error);
        return { success: false, error: "Something went wrong" };
    }
}
