"use client";
import { useEffect, useState } from "react";
import { PaymentStatus, Transaction } from "@prisma/client";
import { getTransactionsAction } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";

const AdminTransactionPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getTransactionsAction()
            .then((data) => {
                if (data.success) {
                    setTransactions(data.data);
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
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Transactions</h1>
                <div className="grid w-full grid-cols-4 items-center justify-between">
                    <p className="text-center text-xl font-semibold">Order Id</p>
                    <p className="text-center text-xl font-semibold">Transaction Id</p>
                    <p className="text-center text-xl font-semibold">Date</p>
                    <p className="text-center text-xl font-semibold">Status</p>
                </div>
                {loading ? (
                    <div className="flex flex-col gap-2">
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                    </div>
                ) : !transactions || transactions?.length == 0 ? (
                    <p className="text-center text-lg font-semibold text-red-500">No transactions yet</p>
                ) : (
                    transactions?.map((t, ind) => {
                        return (
                            <div key={ind} className="grid w-full grid-cols-4 items-center justify-between">
                                <p className="text-center text-xl font-semibold">{t.orderId}</p>
                                <p className="text-xl font-semibold">{t.id}</p>
                                <p className="text-center text-xl font-semibold">{t.createdAt.toDateString()}</p>
                                <p
                                    className={`text-center text-xl font-semibold ${t.status === PaymentStatus.Success ? "text-green-500" : t.status === PaymentStatus.Pending ? "text-orange-400" : "text-red-500"}`}
                                >
                                    {t.status}/
                                </p>
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default AdminTransactionPage;
