export type AdminOrderDetailsType = {
	id: string;
	order_status: OrderStatus;
	createdAt: Date;
	delivery_charge: number;
	packaging: number;
	discount: number;
	delivery_date: Date | null;
	shipping_address: Address;
	order_items: {
		id: string;
		frame: {
			name: string;
			image: string;
		} | null;
		quantity: number;
		customization: CartCustomization;
		single_unit_price: number;
	}[];
	user: {
		name: string | null;
		email: string | null;
	};
	transaction: {
		status: string;
	} | null;
};
