import { NextResponse,NextRequest } from "next/server";
import { db } from "@/lib/db";


type FramesFilterType = {
	categories: string[];
	collections: string[];
	colors: string[];
	name: string;
};

export async function GET(req: NextRequest) {

	const filters: FramesFilterType = {
		categories: req.nextUrl.searchParams.getAll('categories'),
		collections: req.nextUrl.searchParams.getAll('collections'),
		colors: req.nextUrl.searchParams.getAll('colors'),
		name: req.nextUrl.searchParams.get('name')  || ''
	};

    const page = Number(req.nextUrl.searchParams.get('page'));


    
    const validatedFilters = {
        categories: filters.categories.filter((cat) => typeof cat === "string").sort(),
        collections: filters.collections.filter((col) => typeof col === "string").sort(),
        colors: filters.colors.filter((col) => typeof col === "string").sort(),
        name: filters.name,
    };

    try{
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
            varients: true,
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

    return NextResponse.json({success: true,data:{ total, page, frames }},{ status: 200 });
    }catch (error) {
        console.error("Error fetching frames:", error);
        return NextResponse.json( { success: false, error: "Internal Server Error" },{ status: 500 });
      }
    
}

