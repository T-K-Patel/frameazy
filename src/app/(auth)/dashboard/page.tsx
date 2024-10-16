"use client";
import DefaultImage from "../../../../public/Default.svg";
import Image from "next/image";
import { OrderComponent } from "@/components/Order";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getOrdersAction, UserOrders } from "@/serverActions/orders/orders.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const session = useSession();
    const [orders, setOrders] = useState<UserOrders[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

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
        <div className="mx-auto w-11/12 max-w-screen-2xl py-12">
            <section className="mb-12 overflow-hidden rounded-lg border border-[#F1F1F1] p-3">
                <div className="flex justify-between">
                    <h1 className="leading-12 border-b border-[#F1F1F1] pb-3 text-3xl font-semibold">User</h1>
                    <Button
                        onClick={() => {
                            signOut().then(() => {
                                router.push("/", { scroll: true });
                            });
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
                <div className="mt-6">
                    <div className="flex flex-col place-items-center md:flex-row md:p-5">
                        <Image
                            src={session.data?.user?.image || DefaultImage}
                            alt={session.data?.user?.name || "Profile"}
                            width={300}
                            height={300}
                            className="mb-6 max-h-24 max-w-24 md:mb-0 md:mr-6"
                        />
                        <div className="items-center rounded-md p-2 sm:p-5">
                            <div className="flex flex-col gap-x-10 sm:flex-row">
                                <div className="flex gap-5">
                                    <span className="font-semibold leading-9 md:text-xl">Name</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {session.data?.user?.name}
                                </span>
                            </div>
                            <div className="flex flex-col gap-x-10 sm:flex-row">
                                <div className="flex gap-5">
                                    <span className="font-semibold leading-9 md:text-xl">Email</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {session.data?.user?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-12 rounded-md border border-[#F1F1F1] p-3">
                <div>
                    <h1 className="leading-12 mb-6 text-3xl font-semibold">Orders</h1>
                </div>
                {loading ? (
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                    </div>
                ) : error || orders.length == 0 ? (
                    <p className="text-center text-2xl font-semibold text-red-500">{error ?? "No orders yet"}</p>
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
