export type AdminOrdersType = {
	id: string;
	order_status: OrderStatus;
	createdAt: Date;
	delivery_charge: number;
	packaging: number;
	discount: number;
	delivery_date: Date | null;
	transaction: {
		status: string;
	} | null;
	user: {
		name: string | null;
	};
};
