import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
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

	const response = NextResponse.json({ colors, collections, categories }, { status: 200 });

	// Set cache-control headers
	response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

	return response;
}
