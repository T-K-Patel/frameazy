export type CartItemType = {
	id: string;
	customization: CartCustomization;
	quantity: number;
	frame: {
		image: string;
		name: string;
	} | null;
	single_unit_price: number;
	frameVariant: {
		borderWidth: number;
		unit_price: number;
	} | null;
};
