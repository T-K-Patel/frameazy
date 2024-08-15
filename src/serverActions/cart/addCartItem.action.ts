"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomError } from "@/lib/CustomError";
import { db } from "@/lib/db";
import { ServerActionReturnType } from "@/types/serverActionReturnType";
import {
    Customization,
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
    data: Customization,
    { frameId, qty }: { frameId?: string; qty?: number } = {},
): Promise<ServerActionReturnType<string>> {
    try {
        const userId = await isAuthenticated();
        if ((await db.frame.findFirst({ where: { id: frameId } })) === null) {
            throw new CustomError("Invalid frame id");
        }
        qty = Number(qty);
        if (!Number.isInteger(qty) || !Number.isSafeInteger(qty) || qty < 1) {
            throw new CustomError("Quantity must be greater than 0");
        }
        let customization: Customization = {} as Customization;
        if (!isValidNumber(data.width)) {
            throw new CustomError("Invalid width");
        }
        if (!isValidNumber(data.height)) {
            throw new CustomError("Invalid height");
        }
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
                customization.mat = data.mat;
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
                customization.mat = data.mat;
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

        let frame = isframeRequired ? await db.frame.findFirst({ where: { id: frameId } }) : null;

        if (isframeRequired && frame === null) {
            throw new CustomError("Invalid frame id");
        }

        const single_unit_price = 5425; // TODO:calculate price based on customization

        const cartItem = await db.cartItem.create({
            data: {
                userId,
                customization,
                frameId,
                single_unit_price,
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
