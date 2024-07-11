"use server";

import { Category, Collection, Color, Frame } from "@prisma/client";
import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis.client";
import { ServerActionReturnType } from "@/types/serverActionReturnType";

type Filter = {
    category?: Category;
    collection?: Collection;
    width?: number;
    height?: number;
    color?: Color;
};

export type FramesDataType = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export async function getFramesDetailed(filters: Partial<Filter>[]) {
    try {
        const categories: Category[] = filters
            .map((filter) => filter.category)
            .filter((category): category is Category => !!category);

        const collections: Collection[] = filters
            .map((filter) => filter.collection)
            .filter((collection): collection is Collection => !!collection);

        const widths: number[] = filters
            .map((filter) => filter.width)
            .filter((width): width is number => typeof width === "number");

        const heights: number[] = filters
            .map((filter) => filter.height)
            .filter((height): height is number => typeof height === "number");

        const colors: Color[] = filters.map((filter) => filter.color).filter((color): color is Color => !!color);

        const frames = await db.frame.findMany({
            where: {
                ...(categories.length > 0 && { category: { in: categories } }),
                ...(collections.length > 0 && { collection: { in: collections } }),
                ...(widths.length > 0 && { width: { in: widths } }),
                ...(heights.length > 0 && { height: { in: heights } }),
                ...(colors.length > 0 && { color: { in: colors } }),
            },
        });

        return frames;
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong", success: false };
    }
}

export async function getFrame(filter: Partial<Filter>) {
    try {
        const frame = await db.frame.findFirst({
            where: {
                ...(filter.category && { category: filter.category }),
                ...(filter.collection && { collection: filter.collection }),
                ...(filter.width && { width: filter.width }),
                ...(filter.height && { height: filter.height }),
                ...(filter.color && { color: filter.color }),
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
        });

        return { success: true, frames: frame };
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong", success: false };
    }
}

export async function getPopularFramesAction(): Promise<ServerActionReturnType<FramesDataType[]>> {
    try {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const cached = await redisClient
            .get("frames:popularFrames")
            .then((res) => (res ? (JSON.parse(res) as FramesDataType[]) : null));
        if (cached) {
            return { success: true, data: cached };
        }

        // OPTIMIZE: Use more efficient query to get popular frames (this is too slow for production)
        console.log("Fetching popular frames from DB");
        const frames = await db.frame.findMany({
            orderBy: {
                OrderItem: {
                    _count: "desc",
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
            },
            take: 6,
        });
        await redisClient.set("frames:popularFrames", JSON.stringify(frames));
        await redisClient.expire("frames:popularFrames", 60 * 60 * 1); // 1 hour

        return { success: true, data: frames };
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong", success: false };
    }
}
