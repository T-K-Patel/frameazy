import { db } from "@/lib/db";
import { CustomError } from "@/lib/CustomError";
import { isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { TransactionType } from "./response";
export async function GET(): Promise<NextResponse<TransactionType[] | { success: false; error: string }>> {
	try {
		await isAdmin();
		const transactions = await db.transaction.findMany({
			select: {
				id: true,
				amount: true,
				status: true,
				orderId: true,
				paymentOrderId: true,
				paymentId: true,
				updatedAt: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});

		return NextResponse.json(transactions, { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return NextResponse.json({ success: false, error: error.message }, { status: 400 });
		}
		console.error("getTransactionsAction error", error);
		return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
