import { CloudinaryStorage } from "@/lib/Cloudinary.storage";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
	const formData = await req.formData();
	try {
		await isAdmin();
		const productName = formData.get("productName") as string;
		const unitPrice = Number(formData.get("unitPrice"));
		const productImage = formData.get("productImage") as File;
		const borderImage = formData.get("borderImage") as File;
		const productCategory = formData.get("productCategory")?.toString().trim();
		const productColor = formData.get("productColor")?.toString().trim();
		const productCollection = formData.get("productCollection")?.toString().trim();

		const borderWidth = Number(formData.get("borderWidth"));

		if (!productName || productName.length < 3) {
			throw new CustomError("Product Name must be larger than 3 characters.");
		}

		if (isNaN(unitPrice) || !isFinite(unitPrice) || unitPrice <= 0) {
			throw new CustomError("Product Price must be a number and Positive.");
		}

		if (!productImage || !productImage.type.startsWith("image/")) {
			throw new CustomError("Product Image must be a valid image file (JPG, JPEG, PNG, GIF, AVIF).");
		}

		if (!borderImage || !borderImage.type.startsWith("image/")) {
			throw new CustomError("Border Image must be a valid image file (JPEG, PNG, GIF).");
		}

		if (!productCategory || productCategory.length < 3) {
			throw new CustomError("Product Category must be larger than 3 characters.");
		}

		if (!productCollection || productCollection.length < 3) {
			throw new CustomError("Product Collection must be larger than 3 characters.");
		}

		if (!productColor || productColor.length < 3) {
			throw new CustomError("Product Color must be larger than 3 characters.");
		}

		if (!isFinite(borderWidth) || isNaN(borderWidth) || borderWidth <= 0) {
			throw new CustomError("Border Width must be a positive number and finite.");
		}

		const imageBuffer = await productImage.arrayBuffer();
		const imageUrl = await CloudinaryStorage.upload(imageBuffer);
		if (!imageUrl) {
			throw new CustomError("Failed to upload image");
		}
		const borderImageBuffer = await borderImage.arrayBuffer();
		const borderImageUrl = await CloudinaryStorage.upload(borderImageBuffer);
		if (!borderImageUrl) {
			throw new CustomError("Failed to upload image");
		}

		await db.frame.create({
			data: {
				name: productName,
				// unit_price: unitPrice * 100,
				image: imageUrl,
				category: productCategory.toLowerCase(),
				color: productColor.toLowerCase(),
				collection: productCollection.toLowerCase(),
				borderSrc: borderImageUrl,
				// borderWidth: borderWidth,
			},
		});

		return NextResponse.json("Product added successfully", { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getMessagesAction error", error);
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
