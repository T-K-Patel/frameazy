import { CloudinaryStorage } from "@/lib/Cloudinary.storage";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { unstable_calculateTotalPrice } from "@/utils/totalPrice";
import { ObjectIdValidation } from "@/utils/validators";
import { CartCustomization, CustomizationType, Prisma } from "@prisma/client";

function isValidNumber(num: number): boolean {
	num = Number(num);
	return !isNaN(num) && isFinite(num) && num > 0;
}

function validateMatOptions(options: any, type: CustomizationType): Array<{ color: string; width: number }> {
	if (type === CustomizationType.ImageWithMatAndGlazing || type === CustomizationType.EmptyForPaper) {
		return [];
	}
	if (
		!!options &&
		Array.isArray(options) &&
		options.length > 0 &&
		!options.some((mat: any) => {
			if (typeof mat !== "object") {
				return true;
			}
			if (!isValidNumber(mat.width)) {
				return true;
			}
			if (!/#[0-9a-f]{6}/.test(mat.color)) {
				return true;
			}
			return false;
		})
	) {
		return options.map((mat: any) => ({ color: mat.color, width: Number(mat.width) }));
	}
	throw new CustomError("Invalid mat options");
}

const customizationFields: {
	[key in CustomizationType]: Array<keyof CartCustomization>;
} = {
	[CustomizationType.ImagePrintOnly]: ["printing", "image"],
	[CustomizationType.ImageCanvasPrint]: ["printing", "stretching", "sides", "image"],
	[CustomizationType.ImageWithMatAndGlazing]: ["glazing", "printing", "backing", "image"],
	[CustomizationType.ImageWithoutMatAndGlazing]: ["printing", "stretching", "image"],
	[CustomizationType.EmptyForCanvas]: [],
	[CustomizationType.EmptyForPaper]: ["glazing"],
	[CustomizationType.FramedMirror]: ["mirror"],
};

const frameRequired = (type: CustomizationType) => {
	return [
		"ImageWithMatAndGlazing",
		"ImageWithoutMatAndGlazing",
		"EmptyForCanvas",
		"EmptyForPaper",
		"FramedMirror",
	].includes(type);
};

const validateFrame = async (frameId: string, type: CustomizationType, borderWidth: number | null) => {
	if (!frameRequired(type)) return { frame: null, variant: null };
	if (!frameId || !borderWidth) {
		throw new CustomError("Frame is required");
	}
	ObjectIdValidation(frameId, "Invalid frameId");
	const frame = await db.frame.findFirst({
		where: { id: frameId },
		select: { variants: true, id: true },
	});
	if (!frame) {
		throw new CustomError("Invalid frameId");
	}
	const variant = frame.variants.find((v) => v.borderWidth === borderWidth);
	if (!variant) {
		throw new CustomError("Invalid frame Variant");
	}
	return { frame, variant };
};

async function validateOption(_db: any, name: string, type: CustomizationType, field: string) {
	if (customizationFields[type].includes(field as keyof CartCustomization)) {
		if (!name) Promise.reject(new CustomError(`${field} is required`));
		try {
			const option = await _db.findFirst({
				where: {
					name,
				},
			});
			return option as { id: string; name: string; unit_price: number } | null;
		} catch (error) {
			console.error("validateOption error", error);
			return Promise.reject(new CustomError("Something went wrong"));
		}
	}
	return null;
}

const handleImage = async (image: string | null, externalImage: boolean, type: CustomizationType) => {
	if (type.startsWith("Image")) {
		if (!image) {
			throw new CustomError("Image is required");
		}
		if (externalImage) {
			try {
				const url = new URL(image);
				if (url.protocol !== "https:") {
					throw new CustomError("Invalid image url");
				}
				if (url.hostname !== "img.freepik.com") {
					throw new CustomError("Invalid image url");
				}
				const imageFileResp = await fetch(url.toString());
				// file should be an image file
				if (!imageFileResp.headers.get("content-type")?.startsWith("image/")) {
					throw new CustomError("Invalid image url");
				}
				return url.toString();
			} catch {
				throw new CustomError("Invalid image url");
			}
		} else {
			try {
				const imageFileResp = await fetch(image);
				// file should be an image file
				if (!imageFileResp.headers.get("content-type")?.startsWith("image/")) {
					throw new CustomError("Invalid image url");
				}
				const imageFile = await imageFileResp.blob();
				const imageArraybuffer = await imageFile.arrayBuffer();
				const imageurl = await CloudinaryStorage.upload(imageArraybuffer);

				if (!imageurl) {
					throw new CustomError("Failed to upload image");
				}
				return imageurl;
			} catch (error) {
				console.error("addCartItemAction error", error);
				throw new CustomError("Failed to upload image");
			}
		}
	}
	return null;
};

async function validateCustomization(data: any) {
	const type = data.type as CustomizationType;
	// validate type to be one of the CustomizationType
	if (!type || !Object.values(CustomizationType).includes(type)) {
		throw new CustomError("Invalid type");
	}
	const [glazing, mirror, backing, printing, sides, stretching] = await Promise.all([
		validateOption(db.glazing, String(data.glazing), type, "glazing"),
		validateOption(db.mirror, String(data.mirror), type, "mirror"),
		validateOption(db.backing, String(data.backing), type, "backing"),
		validateOption(db.printing, String(data.printing), type, "printing"),
		validateOption(db.sides, String(data.sides), type, "sides"),
		validateOption(db.stretching, String(data.stretching), type, "stretching"),
	]);

	const _image = data.image || (null as string | null);
	const isExternalImage = data.externalImage === "true" || false;
	const image = await handleImage(_image, isExternalImage, type);

	const width = isValidNumber(data.width) ? Number(data.width) : null;
	const height = isValidNumber(data.height) ? Number(data.height) : null;
	const qty = Number(data.qty || 1);
	if (!Number.isInteger(qty) || !Number.isSafeInteger(qty) || qty < 1) {
		throw new CustomError("Quantity must be greater than 0");
	}
	const frameId = data.frameId;
	const frameBorderWidth = Number(data.frameBorderWidth) || null;

	if (!width) {
		throw new CustomError("Invalid width");
	}
	if (!height) {
		throw new CustomError("Invalid height");
	}
	const mat = validateMatOptions(data.mat, type);

	const { frame, variant } = await validateFrame(frameId, type, frameBorderWidth);

	const cartCustomization: Prisma.CartCustomizationCreateArgs["data"] = {
		type: type,
		width: width,
		height: height,
		mat: { set: mat },
		glazing: glazing?.name || null,
		mirror: mirror?.name || null,
		backing: backing?.name || null,
		printing: printing?.name || null,
		sides: sides?.name || null,
		stretching: stretching?.name || null,
		image: image,
	};

	const priceInPaisa = unstable_calculateTotalPrice({
		width,
		height,
		mat,
		glazingRate: glazing?.unit_price || 0,
		mirrorRate: mirror?.unit_price || 0,
		backingRate: backing?.unit_price || 0,
		printingRate: printing?.unit_price || 0,
		sidesRate: sides?.unit_price || 0,
		stretchingRate: stretching?.unit_price || 0,
		frame: variant || undefined,
	});

	return { cartCustomization, priceInPaisa, frame, variant, qty };
}

export { validateCustomization };
