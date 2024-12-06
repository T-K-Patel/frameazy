import Link from "next/link";
import { Button } from "../ui/button";

type OrderCardProps = {
	order: {
		orderId: string;
		orderStatus: string;
		deliveryDate: string;
		paymentStatus: string;
		date: string;
		name?: string;
		total: string;
		items: number;
	};
	isAdmin?: boolean;
};

const OrderCard = ({ order, isAdmin }: OrderCardProps) => {
	const { orderId, orderStatus, deliveryDate, paymentStatus, date, total, name, items } = order;

	return (
		<tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-800">
			{/* Order ID */}
			<td className="px-4 py-2 text-gray-500">
				<div className="text-center">
					<span className="truncate font-medium">...{orderId.slice(-8)}</span>
				</div>
			</td>

			{/* Name */}
			{isAdmin && (
				<td className="px-4 py-2 text-center">
					<div className="flex flex-col">
						<span className="font-medium">{name}</span>
					</div>
				</td>
			)}

			{/* Order Status */}
			<td className="px-4 py-2 text-center">
				<div className="flex flex-col">
					<span
						className={`font-medium ${orderStatus === "Approved" ? "text-green-600" : "text-yellow-600"}`}
					>
						{orderStatus}
					</span>
				</div>
			</td>

			{/* Delivery By */}
			<td className="px-4 py-2 text-center">
				<div className="flex flex-col">
					<span className="font-medium">{deliveryDate}</span>
				</div>
			</td>

			{/* Payment Status */}
			<td className="px-4 py-2 text-center">
				<div className="flex flex-col">
					<span
						className={`font-medium ${paymentStatus === "Uninitiated" ? "text-red-500" : "text-green-600"}`}
					>
						{paymentStatus}
					</span>
				</div>
			</td>

			{/* Order Date */}
			<td className="px-4 py-2 text-center">
				<div className="flex flex-col">
					<span className="font-medium">{date}</span>
				</div>
			</td>

			{/* Number of items */}
			<td className="px-4 py-2 text-center">
				<div className="flex flex-col">
					<span className="font-medium">{items}</span>
				</div>
			</td>

			{/* Total */}
			<td className="px-4 py-2 text-right">
				<div className="flex flex-col">
					<span className="font-bold">{total}</span>
				</div>
			</td>

			{/* Action Button */}
			<td className="px-4 py-2 text-center">
				<Link href={`${isAdmin ? "/admin" : ""}/orders/${orderId}`}>
					<Button size={"sm"} className="px-3 py-1 text-xs">
						Details +
					</Button>
				</Link>
			</td>
		</tr>
	);
};

export default OrderCard;
