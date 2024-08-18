"use client";
import { OrderComponent } from "@/components/Order";
import React, { useState, useEffect } from "react";
import { getOrdersAction } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOrdersType } from "@/serverActions/admin/admin.action";

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
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="mb-12 rounded-md border border-[#F1F1F1] p-3">
                <header>
                    <h1 className="leading-12 items-center text-3xl font-semibold">Orders</h1>
                </header>
                {loading ? (
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                    </div>
                ) : orders.length == 0 ? (
                    <p className="text-center text-2xl font-semibold text-red-500">{error ?? "No new orders"}</p>
                ) : (
                    orders.map((order, index) => {
                        return <OrderComponent key={index} order={order} />;
                    })
                )}
            </section>
        </div>
    );
};

export default AdminOrdersPage;
