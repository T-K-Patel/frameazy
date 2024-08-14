"use server";

import { Category, Collection, Color, OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { CustomError } from "@/lib/CustomError";

export type FramesFilterType = {
    categories: Category[];
    collections: Collection[];
    aspects: { height: number; width: number }[];
    colors: Color[];
};

export type PopularFrameDataType = {
    id: string;
    name: string;
    unit_price: number;
    height: number | null;
    width: number | null;
    image: string;
};
export type FrameDataType = PopularFrameDataType & {
    color: Color,
    collection: Collection,
    category: Category
}

export async function getFramesAction(
    filters: FramesFilterType,
    page: number
): Promise<ServerActionReturnType<{ total: number; frames: FrameDataType[] }>> {
    try {
        const frames = await db.frame.findMany({
            where: {
                AND: [
                    filters.categories.length > 0 ? { category: { in: filters.categories } } : {},
                    filters.collections.length > 0 ? { collection: { in: filters.collections } } : {},
                    filters.colors.length > 0 ? { color: { in: filters.colors } } : {},
                ],
            },
            select: {
                id: true,
                name: true,
                unit_price: true,
                height: true,
                width: true,
                color: true,
                collection: true,
                category: true,
                image: true,
            },
            skip: page * 18,
            take: 18
        });
        const total = await db.frame.count({
            where: {
                AND: [
                    filters.categories.length > 0 ? { category: { in: filters.categories } } : {},
                    filters.collections.length > 0 ? { collection: { in: filters.collections } } : {},
                    filters.colors.length > 0 ? { color: { in: filters.colors } } : {},
                ],
            },
        });

        return { success: true, data: { total, frames } };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getFramesAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function getPopularFramesAction(): Promise<ServerActionReturnType<PopularFrameDataType[]>> {
    try {
        const frames = await db.frame.findMany({
            where: {
                OrderItem: {
                    some: {
                        order: {
                            order_status: {
                                in: [
                                    OrderStatus.Approved,
                                    OrderStatus.Delivered,
                                    OrderStatus.Shipped,
                                    OrderStatus.Processing
                                ]
                            }
                        }
                    }
                }
            },
            orderBy: {
                OrderItem: {
                    _count: "desc",
                },
            },
            take: 6,
            select: {
                id: true,
                name: true,
                unit_price: true,
                height: true,
                width: true,
                image: true,
            }
        });

        return { success: true, data: frames };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getPopularFramesAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
