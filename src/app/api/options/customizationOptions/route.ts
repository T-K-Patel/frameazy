import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type TModel = "mirror" | "sides" | "stretching" | "backing" | "printing" | "glazing";

export async function GET(req: NextRequest) {
    const models = ["mirror", "sides", "stretching", "backing", "printing", "glazing"] as TModel[];

    const resp = {} as Record<TModel, any[]>;

    await Promise.all(
        models.map(async (option) => {
            if (req.nextUrl.searchParams.get(option) === "true") {
                resp[option] = [];
                const d = await (db[option] as any).findMany({ select: { name: true, id: false, unit_price: true } });
                resp[option] = d;
            }
        }),
    );

    return NextResponse.json(resp, { status: 200 });
}
