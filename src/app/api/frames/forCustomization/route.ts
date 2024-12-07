import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type FramesForCustomizationType = {
	id: string;
	name: string;
	borderSrc: string;
	varients: {
		borderWidth: number;
		unit_price: number;
	}[];
};

export async function GET() {
	try {
		const frames: FramesForCustomizationType[] = await db.frame.findMany({
			select: {
				id: true,
				name: true,
				borderSrc: true,
				varients: true,
			},
		});

		const resp = NextResponse.json(frames, { status: 200 });

		resp.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
		return resp;
	} catch (error) {
		console.error("Error fetching frames:", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
