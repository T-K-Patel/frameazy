import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET(req: NextRequest) {
    const colors = (await db.color.findMany({
        select: {
            name: true,
        },
    })).map((color) => color.name);

    const categories = (await db.category.findMany({
        select: {
            name: true,
        },
    })).map((category) => category.name);

    const collections = (await db.collection.findMany({
        select: {
            name: true,
        },
    })).map((collection) => collection.name);

    return NextResponse.json({ colors, collections, categories }, { status: 200 });
}








