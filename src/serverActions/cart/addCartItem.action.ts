"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CloudinaryStorage } from "@/lib/Cloudinary.storage";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import { calculateTotalPrice } from "@/utils/totalPrice";
import { ObjectIdValidation } from "@/utils/validators";
import {
    CartCustomization,
    CustomizationType,
    Printing,
    Stretching,
    Sides,
    Glazing,
    Backing,
    Mirror,
} from "@prisma/client";
import { getServerSession } from "next-auth";
async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new CustomError("Unauthorized");
    }
    return session.user.id;
}

function isValidNumber(num: number): boolean {
    num = Number(num);
    return !isNaN(num) && isFinite(num) && num > 0;
}

function isvalidMatOptions(options: any): boolean {
    return (
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
            if (!/\#[0-9a-f]{6}/.test(mat.color)) {
                return true;
            }
            return false;
        })
    );
}

export async function addCartItemAction(
    data: Omit<CartCustomization, "id">,
    { frameId, qty, externalImage }: { frameId?: string; qty?: number; externalImage?: boolean } = {},
): Promise<ServerActionReturnType<string>> {
    try {
        const userId = await isAuthenticated();
        qty = Number(qty || 1);
        if (!Number.isInteger(qty) || !Number.isSafeInteger(qty) || qty < 1) {
            throw new CustomError("Quantity must be greater than 0");
        }

        let customization: CartCustomization = { mat: [] as CartCustomization["mat"] } as CartCustomization;

        if (!isValidNumber(data.width)) {
            throw new CustomError("Invalid width");
        }
        if (!isValidNumber(data.height)) {
            throw new CustomError("Invalid height");
        }
        customization.width = data.width;
        customization.height = data.height;
        let isframeRequired = false;
        switch (data.type) {
            case CustomizationType.ImagePrintOnly:
                if (!data.printing || !Object.keys(Printing).includes(data.printing)) {
                    throw new CustomError("Invalid printing option");
                }
                customization.printing = data.printing;
                break;
            case CustomizationType.ImageCanvasPrint:
                if (!data.printing || !Object.keys(Printing).includes(data.printing)) {
                    throw new CustomError("Invalid printing option");
                }
                customization.printing = data.printing;
                if (!data.stretching || !Object.keys(Stretching).includes(data.stretching)) {
                    throw new CustomError("Invalid stretching option");
                }
                customization.stretching = data.stretching;
                if (!data.sides || !Object.keys(Sides).includes(data.sides)) {
                    throw new CustomError("Invalid sides option");
                }
                customization.sides = data.sides;
                break;
            case CustomizationType.ImageWithMatAndGlazing:
                // frame
                if (!frameId) {
                    throw new CustomError("Frame is required");
                }
                isframeRequired = true;
                // customization.matOptions
                if (!isvalidMatOptions(data.mat)) {
                    throw new CustomError("Invalid mat options");
                }
                customization.mat = data.mat.map((mat) => ({ color: mat.color, width: Number(mat.width) }));
                // customization.glazing
                if (!data.glazing || !Object.keys(Glazing).includes(data.glazing)) {
                    throw new CustomError("Invalid glazing option");
                }
                customization.glazing = data.glazing;
                // customization.printing
                if (!data.printing || !Object.keys(Printing).includes(data.printing)) {
                    throw new CustomError("Invalid printing option");
                }
                customization.printing = data.printing;
                // custo
                if (!data.backing || !Object.keys(Backing).includes(data.backing)) {
                    throw new CustomError("Invalid backing option");
                }
                customization.backing = data.backing;
                break;
            case CustomizationType.ImageWithoutMatAndGlazing:
                // frame
                if (!frameId) {
                    throw new CustomError("Frame is required");
                }
                isframeRequired = true;
                // customization.printing
                if (!data.printing || !Object.keys(Printing).includes(data.printing)) {
                    throw new CustomError("Invalid printing option");
                }
                customization.printing = data.printing;
                // customization.stretching
                if (!data.stretching || !Object.keys(Stretching).includes(data.stretching)) {
                    throw new CustomError("Invalid stretching option");
                }
                customization.stretching = data.stretching;
                break;
            case CustomizationType.EmptyForCanvas:
                // frame
                if (!frameId) {
                    throw new CustomError("Frame is required");
                }
                isframeRequired = true;
                break;
            case CustomizationType.EmptyForPaper:
                // frame
                if (!frameId) {
                    throw new CustomError("Frame is required");
                }
                isframeRequired = true;
                // customization.matOptions
                if (!isvalidMatOptions(data.mat)) {
                    throw new CustomError("Invalid mat options");
                }
                customization.mat = data.mat.map((mat) => ({ color: mat.color, width: Number(mat.width) }));
                // customization.glazing
                if (!data.glazing || !Object.keys(Glazing).includes(data.glazing)) {
                    throw new CustomError("Invalid glazing option");
                }
                customization.glazing = data.glazing;
                break;
            case CustomizationType.FramedMirror:
                // frame
                if (!frameId) {
                    throw new CustomError("Frame is required");
                }
                isframeRequired = true;
                // customization.minor
                if (!data.mirror || !Object.keys(Mirror).includes(data.mirror)) {
                    throw new CustomError("Invalid mirror option");
                }
                customization.mirror = data.mirror;
                break;
            default:
                throw new CustomError("Invalid customization type");
        }
        customization.type = data.type;
        if (customization.type.startsWith("Image")) {
            if (!data.image) {
                throw new CustomError("Image is required");
            }
            customization.image = data.image;
        }
        console.log("Fetching Frame");
        let frame: { unit_price: number; borderWidth: number } | undefined = undefined;
        if (isframeRequired) {
            ObjectIdValidation(frameId, "Invalid frameId");
            console.log("Validation Passed:", frameId);
            frame =
                (await db.frame.findFirst({
                    where: { id: frameId },
                    select: { unit_price: true, borderWidth: true },
                })) || undefined;
            if (frame === null) {
                throw new CustomError("Invalid frame id");
            }
        }

        const single_unit_price = calculateTotalPrice(customization, frame); // TODO:calculate price based on customization

        if (customization.image) {
            if (externalImage) {
                try {
                    const url = new URL(customization.image);
                    if (!["http:", "https:"].includes(url.protocol)) {
                        throw new CustomError("Invalid image url");
                    }
                    if (url.hostname !== "img.freepik.com") {
                        throw new CustomError("Invalid image url");
                    }
                    const imageFileResp = await fetch(customization.image);
                    // file should be an image file
                    if (!imageFileResp.headers.get("content-type")?.startsWith("image/")) {
                        throw new CustomError("Invalid image url");
                    }
                } catch (e) {
                    throw new CustomError("Invalid image url");
                }
            } else {
                try {
                    const imageFileResp = await fetch(customization.image);
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
                    customization.image = imageurl;
                } catch (error) {
                    console.error("addCartItemAction error", error);
                    throw new CustomError("Failed to upload image");
                }
            }
        }
        const custId = await db.cartCustomization
            .create({
                data: {
                    ...customization,
                    mat: {
                        set: customization.mat || [],
                    },
                },
            })
            .then((data) => data.id);

        const cartItem = await db.cartItem.create({
            data: {
                userId,
                customizationId: custId,
                frameId: frameId || undefined,
                single_unit_price,
                quantity: qty,
            },
        });

        if (cartItem === null) {
            throw new CustomError("Failed to add item to cart");
        }

        return { success: true, data: cartItem.id };
    } catch (error) {
        console.log(error);
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("addCartItem error", error);
        return { success: false, error: "Something went wrong" };
    }
}
