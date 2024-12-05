import React from "react";
import OrderCard from "./OrderCard";

type OrderTableProps = {
    orders: {
        id: string;
        order_status: string;
        delivery_date: Date;
        transaction: {
            status: string;
        };
        user: {
            name: string;
        };
        createdAt: Date;
        packaging: number;
        delivery_charge: number;
        discount: number;
        _count: {
            order_items: number;
        };
    }[];
};

function OrderTable({ orders }: OrderTableProps) {
    const isAdmin = location.pathname.startsWith("/admin");
    return (
        <table className="mb-3 w-full">
            <thead>
                <tr className="bg-gray-200 text-sm text-gray-500">
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Order Status</th>
                    {isAdmin && <th className="px-4 py-2">Name</th>}
                    <th className="px-4 py-2">Delivery By</th>
                    <th className="px-4 py-2">Payment Status</th>
                    <th className="px-4 py-2">Order Date</th>
                    <th className="px-4 py-2">No. of Items</th>
                    <th className="px-4 py-2 text-right">Total (₹)</th>
                    <th className="px-4 py-2">Action</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order, index) => {
                    const amount =
                        (order.packaging + order.delivery_charge - order.discount + order.delivery_charge) / 100;
                    return (
                        <OrderCard
                            key={index}
                            order={{
                                orderId: order.id,
                                orderStatus: order.order_status,
                                deliveryDate: order.delivery_date?.toLocaleDateString("en-in") || "--",
                                paymentStatus: order.transaction?.status || "Uninitiated",
                                date: order.createdAt.toLocaleDateString("en-in"),
                                total: amount.toFixed(2),
                                name: order.user?.name,
                                items: order._count.order_items,
                            }}
                            isAdmin={isAdmin}
                        />
                    );
                })}
            </tbody>
        </table>
    );
}

export default OrderTable;
