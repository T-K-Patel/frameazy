"use server";

import { Category, Collection, Color, OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { CustomError } from "@/lib/CustomError";

export type FramesFilterType = {
    categories: Category[];
    collections: Collection[];
    colors: Color[];
    name: string;
};

export type PopularFrameDataType = {
    id: string;
    name: string;
    unit_price: number;
    image: string;
};
export type FrameDataType = PopularFrameDataType & {
    color: Color;
    collection: Collection;
    category: Category;
};

export async function getFramesAction(
    filters: FramesFilterType,
    page: number,
): Promise<ServerActionReturnType<{ total: number; page: number; frames: FrameDataType[] }>> {
    try {
        const validatedFilters = {
            categories: filters.categories.filter((cat) => { return Category[cat] }).sort(),
            collections: filters.collections.filter((col) => { return Collection[col] }).sort(),
            colors: filters.colors.filter((col) => { return Color[col] }).sort(),
            name: filters.name
        }
        const frames = await db.frame.findMany({
            where: {
                AND: [
                    validatedFilters.categories.length > 0 ? { category: { in: validatedFilters.categories } } : {},
                    validatedFilters.collections.length > 0 ? { collection: { in: validatedFilters.collections } } : {},
                    validatedFilters.colors.length > 0 ? { color: { in: validatedFilters.colors } } : {},
                    validatedFilters.name ? { name: { contains: validatedFilters.name, mode: 'insensitive' } } : {},
                ],
            },
            select: {
                id: true,
                name: true,
                unit_price: true,
                color: true,
                collection: true,
                category: true,
                image: true,
            },
            skip: page * 18,
            take: 18,
        });
        const total = await db.frame.count({
            where: {
                AND: [
                    validatedFilters.categories.length > 0 ? { category: { in: validatedFilters.categories } } : {},
                    validatedFilters.collections.length > 0 ? { collection: { in: validatedFilters.collections } } : {},
                    validatedFilters.colors.length > 0 ? { color: { in: validatedFilters.colors } } : {},
                    validatedFilters.name ? { name: { contains: validatedFilters.name, mode: 'insensitive' } } : {},
                ],
            },
        });

        return { success: true, data: { total, page, frames } };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getFramesAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}


export type FramesForCustomizationType = {
    id: string;
    name: string;
    borderSrc: string;
    borderWidth: number;
    unit_price: number;
}

export async function getFramesForCustomizatinAction(): Promise<ServerActionReturnType<FramesForCustomizationType[]>> {
    try {

        // LATER: Caching needed
        const frames = await db.frame.findMany({
            select: {
                id: true,
                name: true,
                unit_price: true,
                borderSrc: true,
                borderWidth: true,
            },
        });

        return { success: true, data: frames };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getFramesForCustomizatinAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function getPopularFramesAction(): Promise<ServerActionReturnType<PopularFrameDataType[]>> {
    try {
        // const fetchedFrameIds = new Set<string>();

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
                                    OrderStatus.Processing,
                                ],
                            },
                        },
                    },

                },
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
                image: true,
            },
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
