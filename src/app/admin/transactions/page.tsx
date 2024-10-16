"use client";
import { useEffect, useState } from "react";
import { PaymentStatus } from "@prisma/client";
import { getTransactionsAction, TransactionType } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";

const AdminTransactionPage = () => {
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        getTransactionsAction()
            .then((data) => {
                if (data.success) {
                    setTransactions(data.data);
                    setError(null);
                } else {
                    setError(data.error);
                    setTransactions([]);
                }
            })
            .catch((error) => {
                setError(error);
                setTransactions([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Transactions</h1>
                {loading ? (
                    <div className="flex flex-col gap-2">
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                        <Skeleton className="md:h-18 h-10 rounded-xl" />
                    </div>
                ) : error || transactions?.length == 0 ? (
                    <p className="text-center text-lg font-semibold text-red-500">{error ?? "No transactions yet"}</p>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="w-fit items-center gap-x-8 rounded-lg border-b border-[#F1F1F1] *:p-3">
                                    <th className="text-center font-semibold md:text-xl">Id</th>
                                    <th className="text-center font-semibold md:text-xl">Order Id</th>
                                    <th className="text-center font-semibold md:text-xl">PaymentOrder Id</th>
                                    <th className="text-center font-semibold md:text-xl">Payment Id</th>
                                    <th className="text-center font-semibold md:text-xl">Amount (₹)</th>
                                    <th className="text-center font-semibold md:text-xl">Date</th>
                                    <th className="text-center font-semibold md:text-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="w-full">
                                {transactions?.map((t, ind) => {
                                    return (
                                        <tr
                                            key={ind}
                                            className="w-fit items-center gap-x-8 rounded-lg border-b border-[#F1F1F1] *:p-3"
                                        >
                                            <td className="text-center font-semibold md:text-xl" title={t.id}>
                                                ...{t.id.substring(16)}
                                            </td>
                                            <td className="text-center font-semibold md:text-xl" title={t.orderId}>
                                                ...{t.orderId.substring(16)}
                                            </td>
                                            <td className="text-nowrap text-center font-semibold md:text-xl">
                                                {t.paymentOrderId}
                                            </td>
                                            <td className="text-nowrap text-center font-semibold md:text-xl">
                                                {t.paymentId || "N/A"}
                                            </td>
                                            <td className="text-nowrap text-center font-semibold md:text-xl">
                                                {(t.amount / 100).toFixed(2)}
                                            </td>
                                            <td className="text-nowrap text-center font-semibold md:text-xl">
                                                {t.updatedAt.toDateString()}
                                            </td>
                                            <td
                                                className={`text-nowrap text-center font-semibold md:text-xl ${t.status === PaymentStatus.Paid ? "text-green-500" : t.status === PaymentStatus.Attempted ? "text-orange-400" : "text-red-500"}`}
                                            >
                                                {t.status}
                                            </td>
                                        </tr>
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

export default AdminTransactionPage;
