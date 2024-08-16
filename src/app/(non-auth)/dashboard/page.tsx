"use client";
import Image from "next/image";
import DefaultImage from "../../../../public/Default.svg";
import { OrderComponent } from "@/components/Order";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getOrdersAction, UserOrders } from "@/serverActions/orders/orders.action";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
    const session = useSession();
    const [orders, setOrders] = useState<UserOrders[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrdersAction()
            .then((data) => {
                if (data.success) {
                    setOrders(data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="mx-auto w-5/6 max-w-screen-2xl py-12">
            <section className="mb-12 overflow-hidden rounded-lg border border-[#F1F1F1] p-3">
                <header>
                    <h1 className="leading-12 border-b border-[#F1F1F1] pb-3 text-3xl font-semibold">User</h1>
                </header>
                <div className="mt-6">
                    <div className="grid grid-cols-1 place-items-center md:grid-cols-3">
                        <Image
                            src={session.data?.user?.image || DefaultImage}
                            alt={session.data?.user?.name || "Profile"}
                            width={300}
                            height={300}
                            className="max-h-3/4 max-w-43 col-span-1 mb-6 h-16 w-16 md:mb-0 md:mr-6 md:h-1/2 md:w-1/2"
                        />
                        <div className="rounded-md p-5">
                            <div className="mb-5 grid grid-cols-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold leading-9 md:text-xl">Name</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="ml-12 font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {session.data?.user?.name}
                                </span>
                            </div>
                            <div className="mb-5 grid grid-cols-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold leading-9 md:text-xl">Email</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="ml-12 font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {session.data?.user?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-12 rounded-md border border-[#F1F1F1] p-3">
                <header>
                    <h1 className="leading-12 mb-6 text-3xl font-semibold">Orders</h1>
                </header>
                {loading ? (
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                    </div>
                ) : orders.length == 0 ? (
                    <p className="text-center text-2xl font-semibold text-red-500">No orders yet</p>
                ) : (
                    orders.map((order, index) => {
                        return <OrderComponent key={index} order={order} />;
                    })
                )}
            </section>
        </div>
    );
};

export default Dashboard;
