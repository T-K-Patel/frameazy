"use client"
import React, { useState, useEffect } from "react";
import { Message } from "@prisma/client"

const MessageItem = ({ message }: { message: Message }) => {
    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-[#F1F1F1] p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="pb-1 font-semibold leading-6">{message.name}</h1>
                    <p className="text-sm font-semibold text-[#A3A1A1]">{message.email}</p>
                </div>
                <p className="text-sm font-semibold">{message.createdAt.toDateString()}</p>
            </div>
            <p className="border border-[#D2D1D1]" />
            <p className="max-w-[1132px] text-sm font-semibold leading-5">{message.message}</p>
        </div>
    );
};

const AdminContactPage = () => {
    const [messages, setMessages] = useState<Message[]>()
    useEffect(() => {
        setMessages([]);
    }, [])
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Orders</h1>
                {messages?.map((m) => {
                    return <MessageItem key={m.id} message={m} />
                })}
            </section>
        </div>
    );
};

export default AdminContactPage;
