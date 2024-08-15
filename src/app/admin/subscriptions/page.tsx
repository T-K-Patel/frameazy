"use client"
import { useState, useEffect } from "react";
import { Subscription, SubscriptionStatus } from "@prisma/client"
import { getSubscriptionsAction } from "@/serverActions/admin/admin.action";

const AdminSubscriptionPage = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>()
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
    }, [])
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Subscriptions</h1>
                {subscriptions?.length==0 ? <p className="font-semibold text-lg text-center">No subscriptions yet</p>:subscriptions?.map((s,ind) => {
                    return (
                        <div className="w-full flex justify-between items-center">
                            <p className="text-xl font-semibold">{ind+1}</p>
                            <p className="text-xl font-semibold">{s.email}</p>
                            <p className="text-xl font-semibold">{s.createdAt.toDateString()}</p>
                            <p className={`text-xl font-semibold ${s.status===SubscriptionStatus.Subscribed?"text-green-500":"text-red-500"}`}>{s.status}</p>
                        </div>
                    )
                })}
            </section>
        </div>
    );
};

export default AdminSubscriptionPage;