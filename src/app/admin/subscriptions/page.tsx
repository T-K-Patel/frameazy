"use client";
import { useState, useEffect } from "react";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import { getSubscriptionsAction } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSubscriptionPage = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getSubscriptionsAction()
            .then((data) => {
                if (data.success) {
                    setSubscriptions(data.data);
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
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Subscriptions</h1>
                {loading ? (
                    <div className="flex flex-col gap-2">
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                    </div>
                ) : !subscriptions || subscriptions?.length == 0 ? (
                    <p className="text-center text-lg font-semibold text-red-500">No subscriptions yet</p>
                ) : (
                    subscriptions?.map((s, ind) => {
                        return (
                            <div key={ind} className="flex w-full items-center justify-between">
                                <p className="text-xl font-semibold">{ind + 1}</p>
                                <p className="text-xl font-semibold">{s.email}</p>
                                <p className="text-xl font-semibold">{s.createdAt.toDateString()}</p>
                                <p
                                    className={`text-xl font-semibold ${s.status === SubscriptionStatus.Subscribed ? "text-green-500" : "text-red-500"}`}
                                >
                                    {s.status}
                                </p>
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default AdminSubscriptionPage;
