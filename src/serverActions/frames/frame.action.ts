"use server";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { CustomError } from "@/lib/CustomError";
import { OrderStatus } from "@prisma/client";

export type FramesFilterType = {
    categories: string[];
    collections: string[];
    colors: string[];
    name: string;
};

export type PopularFrameDataType = {
    id: string;
    name: string;
    unit_price: number;
    image: string;
};
export type FrameDataType = PopularFrameDataType & {
    borderSrc: string;
    borderWidth: number;
    color: string;
    collection: string;
    category: string;
};

export async function getFiltersOptionsAction(): Promise<ServerActionReturnType<{ colors: string[]; collections: string[]; categories: string[] }>> {
    try {
        const colors = (await db.frame.findMany({
            select: {
                color: true,
            },
            distinct: ["color"],
        })).map((frame) => frame.color);

        const categories = (await db.frame.findMany({
            select: {
                category: true,
            },
            distinct: ["category"],
        })).map((frame) => frame.category);

        const collections = (await db.frame.findMany({
            select: {
                collection: true,
            },
            distinct: ["collection"],
        })).map((frame) => frame.collection);

        return { success: true, data: { colors, collections, categories } };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getFiltersOptionsAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function getFramesAction(
    filters: FramesFilterType,
    page: number = 0,
): Promise<ServerActionReturnType<{ total: number; page: number; frames: FrameDataType[] }>> {
    try {
        const validatedFilters = {
            categories: filters.categories.filter((cat) => typeof cat === 'string').sort(),
            collections: filters.collections
                .filter((col) => typeof col === 'string')
                .sort(),
            colors: filters.colors
                .filter((col) => typeof col === 'string')
                .sort(),
            name: filters.name,
        };
        const frames = await db.frame.findMany({
            where: {
                AND: [
                    validatedFilters.categories.length > 0 ? { category: { in: validatedFilters.categories } } : {},
                    validatedFilters.collections.length > 0 ? { collection: { in: validatedFilters.collections } } : {},
                    validatedFilters.colors.length > 0 ? { color: { in: validatedFilters.colors } } : {},
                    validatedFilters.name ? { name: { contains: validatedFilters.name, mode: "insensitive" } } : {},
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
                borderSrc: true,
                borderWidth: true,
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
                    validatedFilters.name ? { name: { contains: validatedFilters.name, mode: "insensitive" } } : {},
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
};

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
