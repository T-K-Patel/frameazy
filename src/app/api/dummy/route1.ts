import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Category, Collection, Color } from "@prisma/client";
import { NextResponse } from "next/server";

function generateFakeFrames() {
    const frames = [];
    const categories = Object.keys(Category);
    const colors = Object.keys(Color);
    const collections = Object.keys(Collection);
    for (let i = 0; i < 100; i++) {
        frames.push({
            name: `frame-${i}`,
            unit_price: Math.floor((Math.random() * 1000 + 50) * 100) / 100,
            image: `https://res.cloudinary.com/dgxfuzqed/image/upload/v1723384497/tbaduzly2ryd6gpn3eqg.avif`,
            borderSrc: `https://res.cloudinary.com/dgxfuzqed/image/upload/v1723392686/yqsyyjoi1wottessqsod.jpg`,
            borderWidth: Math.floor((Math.random() * 3 + 0.5) * 100) / 100,
            category: categories[Math.floor(Math.random() * categories.length)] as Category,
            color: colors[Math.floor(Math.random() * colors.length)] as Color,
            collection: collections[Math.floor(Math.random() * collections.length)] as Collection,
        });
    }
    return frames;
}

// eslint-disable-next-line no-unused-vars
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await db.frame.createMany({
        data: generateFakeFrames(),
    });
    return NextResponse.json({ message: "100 Frames added succesfully" });
}
