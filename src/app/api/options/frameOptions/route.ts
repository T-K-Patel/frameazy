import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const revalidate = 600;

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
	response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");

	return response;
}

async function _addFrameOption(_dbModel: any, value: string) {
	// check for existing frame option
	const existingFrameOption = await _dbModel.findFirst({
		where: {
			name: value,
		},
	});
	if (existingFrameOption) {
		return existingFrameOption as { id: number; name: string };
	}
	const frameOption = await _dbModel.create({
		data: {
			name: value,
		},
	});
	return frameOption as { id: number; name: string };
}

export async function POST(req: NextRequest) {
	try {
		const { name, type } = await req.json();
		if (!name || !type) {
			return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
		}
		if (!["color", "category", "collection"].includes(type)) {
			return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
		}
		const frameOption = await _addFrameOption(db[type], name);
		revalidateTag("frameOptions");
		return NextResponse.json({ success: true, frameOption }, { status: 200 });
	} catch (error) {
		console.log("Error adding frame option", error);
		return NextResponse.json({ success: false, error: "Error adding frame option" }, { status: 500 });
	}
}
