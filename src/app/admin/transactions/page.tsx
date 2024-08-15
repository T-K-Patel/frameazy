"use client"
import { useEffect, useState } from "react";
import { PaymentStatus, Transaction } from "@prisma/client"
import { getTransactionsAction } from "@/serverActions/admin/admin.action";

const AdminTransactionPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>()
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
    }, [])
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Transactions</h1>
                <div className="w-full grid grid-cols-4 justify-between items-center">
                    <p className="text-xl font-semibold text-center">Order Id</p>
                    <p className="text-xl font-semibold text-center">Transaction Id</p>
                    <p className="text-xl font-semibold text-center">Date</p>
                    <p className="text-xl font-semibold text-center">Status</p>
                </div>
                {transactions?.length==0 ? <p className="font-semibold text-lg text-center">No transactions yet</p>:transactions?.map((t) => {
                    return (
                        <div className="w-full grid grid-cols-4 justify-between items-center">
                            <p className="text-xl font-semibold text-center">{t.orderId}</p>
                            <p className="text-xl font-semibold">{t.id}</p>
                            <p className="text-xl font-semibold text-center">{t.createdAt.toDateString()}</p>
                            <p className={`text-xl font-semibold text-center ${t.status===PaymentStatus.Success?"text-green-500":t.status===PaymentStatus.Pending?"text-orange-400":"text-red-500"}`}>{t.status}/</p>
                        </div>
                    )
                })}
            </section>
        </div>
    );
};

export default AdminTransactionPage;