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
	variants: {
		borderWidth: number;
		unit_price: number;
	}[];
	image: string;
};
export type FrameDataType = PopularFrameDataType & {
	borderSrc: string;
	color: string;
	collection: string;
	category: string;
};

// DEPRECATED
export async function getFiltersOptionsAction(): Promise<
	ServerActionReturnType<{ colors: string[]; collections: string[]; categories: string[] }>
> {
	try {
		const colors = (
			await db.color.findMany({
				select: {
					name: true,
				},
			})
		).map((color) => color.name);

		const categories = (
			await db.category.findMany({
				select: {
					name: true,
				},
			})
		).map((category) => category.name);

		const collections = (
			await db.collection.findMany({
				select: {
					name: true,
				},
			})
		).map((collection) => collection.name);

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
			categories: filters.categories.filter((cat) => typeof cat === "string").sort(),
			collections: filters.collections.filter((col) => typeof col === "string").sort(),
			colors: filters.colors.filter((col) => typeof col === "string").sort(),
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
				color: true,
				collection: true,
				category: true,
				image: true,
				borderSrc: true,
				variants: true,
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
	variants: {
		borderWidth: number;
		unit_price: number;
	}[];
};

export async function getFramesForCustomizatinAction(): Promise<ServerActionReturnType<FramesForCustomizationType[]>> {
	try {
		// LATER: Caching needed
		const frames = await db.frame.findMany({
			select: {
				id: true,
				name: true,
				borderSrc: true,
				variants: true,
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
				variants: true,
				image: true,
			},
		});
		if (frames.length < 6) {
			const remainingFrames = await db.frame.findMany({
				where: {
					NOT: {
						id: {
							in: frames.map((frame) => frame.id),
						},
					},
				},
				take: 6 - frames.length,
				select: {
					id: true,
					name: true,
					variants: true,
					image: true,
				},
			});
			frames.push(...remainingFrames);
		}

		return { success: true, data: frames };
	} catch (error) {
		if (error instanceof CustomError) {
			return { success: false, error: error.message };
		}
		console.error("getPopularFramesAction error", error);
		return { success: false, error: "Something went wrong" };
	}
}
