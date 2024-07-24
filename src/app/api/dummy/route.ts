import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Category, Collection, Color, Frame } from "@prisma/client";
import { NextResponse } from "next/server";

function generateFakeFrames() {
    const frames = [];
    const categories = Object.keys(Category);
    const colors = Object.keys(Color);
    const collections = Object.keys(Collection);
    for (let i = 0; i < 100; i++) {
        frames.push({
            name: `frame-${i}`,
            price: Math.floor((Math.random() * 1000 + 50) * 100) / 100,
            image: `http://localhost:3000/frame-1.png`,
            category: categories[Math.floor(Math.random() * categories.length)] as Category,
            color: colors[Math.floor(Math.random() * colors.length)] as Color,
            collection: collections[Math.floor(Math.random() * collections.length)] as Collection,
            height: Math.floor(Math.random() * 20 + 3),
            width: Math.floor(Math.random() * 20 + 3),
        });
    }
    return frames;
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await db.frame.createMany({
        data: generateFakeFrames(),
    });
    return NextResponse.json({ message: "100 Frames added succesfully" });
}
