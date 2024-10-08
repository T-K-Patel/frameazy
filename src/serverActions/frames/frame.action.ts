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

export async function getUniqueColors() {
    const frames = await db.frame.findMany({
      select: {
        color: true,
      },
    });
  
    const uniqueColors = new Set<string>();
  
    frames.forEach((frame:any) => {
      if (frame.color) {
        uniqueColors.add(frame.color);
      }
    });
  
    return Array.from(uniqueColors);
  }
export async function getUniqueCollections() {
    const frames = await db.frame.findMany({
      select: {
        collection: true,
      },
    });
  
    const uniqueColors = new Set<string>();
  
    frames.forEach((frame:any) => {
      if (frame.collection) {
        uniqueColors.add(frame.collection);
      }
    });
  
    return Array.from(uniqueColors);
  }
export async function getUniqueCategory() {
    const frames = await db.frame.findMany({
      select: {
        category: true,
      },
    });
  
    const uniqueColors = new Set<string>();
  
    frames.forEach((frame:any) => {
      if (frame.category) {
        uniqueColors.add(frame.category);
      }
    });
  
    return Array.from(uniqueColors);
  }

export async function getFramesAction(
    filters: FramesFilterType,
    page: number,
): Promise<ServerActionReturnType<{ total: number; page: number; frames: FrameDataType[] }>> {
    try {
        const Color:string[]=await getUniqueColors();
        const Category:string[]=await getUniqueCategory();
        const Collection:string[]=await getUniqueCollections();
        const validatedFilters = {
            categories: filters.categories.filter((cat) => Category.includes(cat)).sort(),
            collections: filters.collections.filter((col) => { Collection.includes(col) }).sort(),
            colors: filters.colors.filter((col) => { Color.includes(col) }).sort(),
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
