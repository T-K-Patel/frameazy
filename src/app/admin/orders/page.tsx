"use client";
import React, { useState, useEffect } from "react";
import { getOrdersAction } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOrdersType } from "@/serverActions/admin/admin.action";
import { Button } from "@/components/ui/button";
import AppPagination from "@/components/AppPagination";
import OrderTable from "@/components/Order/OrderTable";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<AdminOrdersType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getOrdersAction()
            .then((data) => {
                if (data.success) {
                    console.log(data.data);
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
            const _amount = (order.packaging + order.delivery_charge - order.discount + order.delivery_charge) / 100;
            const amount = _amount.toLocaleString("en-in");
            return `${order.id},${order.order_status},${order.delivery_date?.toLocaleDateString("en-in")},${order.transaction?.status || "Uninitiated"},${order.createdAt.toLocaleString("en-in", { dateStyle: "medium", timeStyle: "short" })},"${amount}"`;
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
                        <OrderTable orders={orders as any} />
                        <AppPagination page={1} totalPages={5} setPage={(page) => console.log(page)} />
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminOrdersPage;
