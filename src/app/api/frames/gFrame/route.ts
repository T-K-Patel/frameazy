import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { FRAMES_PER_PAGE } from "@/contants/frames";
import { FrameDataType, FramesFilterType } from "./response";

export async function GET(
	req: NextRequest,
): Promise<NextResponse<{ total: number; page: number; frames: FrameDataType[] } | { success: false; error: string }>> {
	const filters: FramesFilterType = {
		categories: req.nextUrl.searchParams.getAll("categories"),
		collections: req.nextUrl.searchParams.getAll("collections"),
		colors: req.nextUrl.searchParams.getAll("colors"),
		name: req.nextUrl.searchParams.get("name") || "",
	};

	const page = Math.max(Number(req.nextUrl.searchParams.get("page")) || 0, 0);

	const validatedFilters = {
		categories: filters.categories.filter((cat) => typeof cat === "string" && cat).sort(),
		collections: filters.collections.filter((col) => typeof col === "string" && col).sort(),
		colors: filters.colors.filter((col) => typeof col === "string" && col).sort(),
		name: filters.name,
	};
	console.log("Fetch request filters", validatedFilters);

	const query: Prisma.FrameFindManyArgs["where"] = {
		AND: [
			validatedFilters.categories.length > 0 ? { category: { in: validatedFilters.categories } } : {},
			validatedFilters.collections.length > 0 ? { collection: { in: validatedFilters.collections } } : {},
			validatedFilters.colors.length > 0 ? { color: { in: validatedFilters.colors } } : {},
			validatedFilters.name ? { name: { contains: validatedFilters.name, mode: "insensitive" } } : {},
		],
	};

	try {
		const frames: FrameDataType[] = await db.frame.findMany({
			where: query,
			select: {
				id: true,
				name: true,
				color: true,
				collection: true,
				category: true,
				image: true,
				borderSrc: true,
				varients: true,
			},
			skip: page * FRAMES_PER_PAGE,
			take: FRAMES_PER_PAGE,
		});
		const total = await db.frame.count({
			where: query,
		});

		return NextResponse.json({ total, page, frames }, { status: 200 });
	} catch (error) {
		console.error("Error fetching frames:", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
