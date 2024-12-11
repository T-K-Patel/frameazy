import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const type = searchParams.get("type");

	const data = await req.json();

	const modelMap = {
		category: db.category,
		mirror: db.mirror,
		frame: db.frame,
		color: db.color,
		glazing: db.glazing,
		printing: db.printing,
		backing: db.backing,
		sides: db.sides,
		stretching: db.stretching,
	};

	const model = modelMap[type as keyof typeof modelMap] as any;
	if (!model) {
		return NextResponse.json({ success: false, error: "Invalid type provided" }, { status: 400 });
	}

	try {
		const existingEntry = await model.findFirst({
			where: {
				name: data.name,
			},
		});

		if (existingEntry) {
			return NextResponse.json(
				{ success: false, error: "Duplicate entry. Record already exists." },
				{ status: 400 },
			);
		}

		const name = String(data.name);
		const unit_price = data.unit_price ? Number(data.unit_price) : undefined;

		if (unit_price !== undefined && isNaN(unit_price)) {
			return NextResponse.json({ success: false, error: "Invalid unit price" }, { status: 400 });
		}

		let newEntry;
		if (["category", "color", "collection"].includes(type!)) {
			newEntry = await model.create({
				data: {
					name: name,
				},
			});
		} else {
			newEntry = await model.create({
				data: {
					name: name,
					unit_price: unit_price,
				},
			});
		}

		return NextResponse.json({ data: newEntry }, { status: 200 });
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ success: false, error: "Failed to save entry" }, { status: 500 });
	}
}
