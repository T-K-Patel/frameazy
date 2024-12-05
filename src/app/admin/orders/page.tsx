"use client";
import React, { useState, useEffect } from "react";
import { getOrdersAction } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOrdersType } from "@/serverActions/admin/admin.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type OrderCardProps = {
    order: {
        orderId: string;
        orderStatus: string;
        deliveryDate: string;
        paymentStatus: string;
        date: string;
        total: string;
    };
};

const OrderCard = ({ order }: OrderCardProps) => {
    const { orderId, orderStatus, deliveryDate, paymentStatus, date, total } = order;

    return (
        <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-800">
            {/* Order ID */}
            <td className="px-4 py-2 text-gray-500">
                <div className="text-center">
                    <span className="truncate font-medium">...{orderId.slice(-8)}</span>
                </div>
            </td>

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

            {/* Total */}
            <td className="px-4 py-2 text-center">
                <div className="flex flex-col">
                    <span className="font-medium">{date}</span>
                </div>
            </td>
            <td className="px-4 py-2 text-right">
                <div className="flex flex-col">
                    <span className="font-bold">{total}</span>
                </div>
            </td>

            {/* Action Button */}
            <td className="px-4 py-2 text-center">
                <Link href={`/admin/orders/${orderId}`}>
                    <Button size={"sm"} className="px-3 py-1 text-xs">
                        Details +
                    </Button>
                </Link>
            </td>
        </tr>
    );
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<AdminOrdersType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getOrdersAction()
            .then((data) => {
                if (data.success) {
                    setOrders(data.data);
                    setError(null);
                } else {
                    setError(data.error);
                    setOrders([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setError("Something went wrong");
                setOrders([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function downloadToCSV() {
        const csv = orders.map((order) => {
            let _amount = (order.packaging + order.delivery_charge - order.discount + order.delivery_charge) / 100;
            let amount = _amount.toLocaleString("en-in");
            return `${order.id},${order.order_status},${order.delivery_date?.toLocaleDateString("en-in")},${order.transaction?.status || "Uninitiated"},${order.createdAt},"${amount}"`;
        });

        const csvData = ["Id,Order Status,Delivery Date,Payment Status,Date,Amount", ...csv].join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="mb-12 rounded-md border border-[#F1F1F1] p-3">
                <header className="mb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Orders</h1>
                    {orders.length > 0 && (
                        <Button size="sm" onClick={downloadToCSV}>
                            Download CSV
                        </Button>
                    )}
                </header>
                {loading ? (
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-60 rounded-xl md:h-28" />
                        <Skeleton className="h-60 rounded-xl md:h-28" />
                        <Skeleton className="h-60 rounded-xl md:h-28" />
                        <Skeleton className="h-60 rounded-xl md:h-28" />
                    </div>
                ) : orders.length == 0 ? (
                    <p className="text-center text-2xl font-semibold text-red-500">{error ?? "No new orders"}</p>
                ) : (
                    <div className="flex flex-col gap-y-5">
                        <table>
                            <thead>
                                <tr className="bg-gray-200 text-sm text-gray-500">
                                    <th className="px-4 py-2">Order ID</th>
                                    <th className="px-4 py-2">Order Status</th>
                                    <th className="px-4 py-2">Delivery By</th>
                                    <th className="px-4 py-2">Payment Status</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2 text-right">Total (₹)</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    const amount =
                                        (order.packaging +
                                            order.delivery_charge -
                                            order.discount +
                                            order.delivery_charge) /
                                        100;
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
                                            }}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminOrdersPage;
