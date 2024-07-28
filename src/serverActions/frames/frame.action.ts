"use server";

import { Category, Collection, Color, Frame } from "@prisma/client";
import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis.client";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { CustomError } from "@/lib/CustomError";

export type FramesFilterType = {
    categories: Category[];
    collections: Collection[];
    aspects: { height: number; width: number }[];
    colors: Color[];
};

export type FramesDataType = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export async function getFramesAction(
    filters: FramesFilterType,
): Promise<ServerActionReturnType<{ total: number; frames: FramesDataType[] }>> {
    try {
        // LATER: Implement pagination and caching
        const frames = await db.frame.findMany({
            where: {
                AND: [
                    ...(filters.categories.length > 0 ? [{ category: { in: filters.categories } }] : []),
                    ...(filters.collections.length > 0 ? [{ collection: { in: filters.collections } }] : []),
                    ...(filters.colors.length > 0 ? [{ color: { in: filters.colors } }] : []),
                    ...(filters.aspects?.length > 0
                        ? filters.aspects.map((aspect) => ({
                              AND: [{ height: { equals: aspect.height } }, { width: { equals: aspect.width } }],
                          }))
                        : []),
                ],
            },
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
            },
        });
        return { data: { frames, total: 100 }, success: true };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getFramesAction error", error);
        return { success: false, error: "Something went wrong" };
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
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("getPopularFramesAction error", error);
        return { success: false, error: "Something went wrong" };
    }
}
