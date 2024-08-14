"use client"
import { useState, useEffect } from "react";
import { Subscription } from "@prisma/client"

const AdminSubscriptionPage = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>()
    useEffect(() => {
        setSubscriptions([]);
    }, [])
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Orders</h1>
                {subscriptions?.map((t) => {
                    return (<div key={t.id}>

                    </div>)
                })}
            </section>
        </div>
    );
};

export default AdminSubscriptionPage;