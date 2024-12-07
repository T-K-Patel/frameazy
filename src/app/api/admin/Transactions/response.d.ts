export type TransactionType = {
	id: string;
	orderId: string;
	paymentOrderId: string;
	paymentId: string | null;
	amount: number;
	status: PaymentStatus;
	updatedAt: Date;
};
