import { CartCustomization } from "@prisma/client";
import {
	GlazingPrice,
	BackingPrice,
	SidesPrice,
	StretchingPrice,
	MirrorPrice,
	PrintingPrice,
	MAT_PRICE,
} from "@/contants/pricings";

/**
 * @deprecated This function is deprecated. Use `unstable_calculateTotalPrice` instead.
 */
export function calculateTotalPrice(
	customization: Omit<CartCustomization, "id">,
	frame?: { unit_price: number; borderWidth: number },
) {
	let height = customization.height;
	let width = customization.width;

	const backingPrice = customization.backing ? BackingPrice[customization.backing] * height * width : 0;
	const stretchingPrice = customization.stretching ? StretchingPrice[customization.stretching] * height * width : 0;
	const sidesPrice = customization.sides ? SidesPrice[customization.sides] * height * width : 0;
	const mirrorPrice = customization.mirror ? MirrorPrice[customization.mirror] * height * width : 0;

	let totalPrice = 0;
	if (frame) {
		totalPrice += 2 * frame.unit_price * (height + width);
		height -= 2 * frame.borderWidth;
		width -= 2 * frame.borderWidth;
	}

	const glazingPrice = customization.glazing ? GlazingPrice[customization.glazing] * height * width : 0;

	customization.mat?.forEach((m) => {
		totalPrice += MAT_PRICE * (height * width - (height - 2 * m.width) * (width - 2 * m.width));
		height -= 2 * m.width;
		width -= 2 * m.width;
	});

	const printingPrice = customization.printing ? PrintingPrice[customization.printing] * height * width : 0;

	totalPrice += glazingPrice + backingPrice + stretchingPrice + sidesPrice + mirrorPrice + printingPrice;
	return totalPrice;
}

type TPriceCalculation = {
	frame?: { unit_price: number; borderWidth: number };
	height: number;
	width: number;
	backingRate?: number;
	stretchingRate?: number;
	sidesRate?: number;
	mirrorRate?: number;
	glazingRate?: number;
	mat?: { width: number }[];
	printingRate?: number;
};

export function unstable_calculateTotalPrice({
	frame,
	height,
	width,
	backingRate = 0,
	stretchingRate = 0,
	sidesRate = 0,
	mirrorRate = 0,
	glazingRate = 0,
	mat = [],
	printingRate = 0,
}: TPriceCalculation) {
	const backingPrice = backingRate * height * width;
	const stretchingPrice = stretchingRate * height * width;
	const sidesPrice = sidesRate * height * width;
	const mirrorPrice = mirrorRate * height * width;

	let totalPrice = 0;
	if (frame) {
		totalPrice += 2 * frame.unit_price * (height + width);
		height -= 2 * frame.borderWidth;
		width -= 2 * frame.borderWidth;
	}

	const glazingPrice = glazingRate * height * width;

	mat.forEach((m) => {
		totalPrice += MAT_PRICE * (height * width - (height - 2 * m.width) * (width - 2 * m.width));
		height -= 2 * m.width;
		width -= 2 * m.width;
	});

	const printingPrice = printingRate * height * width;

	totalPrice += glazingPrice + backingPrice + stretchingPrice + sidesPrice + mirrorPrice + printingPrice;
	return totalPrice;
}

export function getDeliveryCharge(totalPrice: number) {
	if (totalPrice < 50000) {
		return 7000;
	} else if (totalPrice < 100000) {
		return 3500;
	} else {
		return 0;
	}
}
