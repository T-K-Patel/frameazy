"use client";
import CustomizeDropDown from "@/components/CustomizeDropDown";
import { CartItem } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
const Item = ({ item }: { item: CartItem }) => {
    return (
        <div className="flex flex-col items-center justify-between gap-y-2 md:flex-row">
            <div className="flex items-center justify-between md:gap-8">
                <div className="h-full w-16 overflow-hidden rounded-xl bg-gray-2" />
            </div>
        </div>
    );
};

const DeliveryStatus = ({ status, value }: { status: string; value: string }) => {
    return (
        <p className={`text-lg font-semibold ${value === status ? "text-[#A3A1A1]" : "text-black"} text-center`}>
            {status}
        </p>
    );
};
const OrderDetails = ({ params }: { params: { id: string } }) => {
    const [order, setOrder] = useState({ paymentStatus: "Pending", deliveryStatus: "Pending" }); //TODO fetching order with the id;
    return (
        <div className="mx-auto flex w-5/6 max-w-screen-2xl flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2 rounded-2xl border border-[#F1F1F1] px-4 py-6 md:gap-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-3 text-3xl font-semibold">
                    Update Order Status
                </h1>
                <CustomizeDropDown
                    value={order.deliveryStatus}
                    onChange={(status: string) => {
                        setOrder({ ...order, deliveryStatus: status });
                    }}
                    items={["Pending", "Out for delivery", "Delivered", "Cancelled"]}
                />
            </div>
            <div className="flex flex-col gap-5 rounded-2xl border border-[#F1F1F1] px-4 py-6">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-3 text-3xl font-semibold">Order Items</h1>

                <div className="flex flex-col gap-4"></div>
            </div>
            <div className="flex flex-col gap-5 rounded-2xl border border-[#F1F1F1] p-2 px-4 py-6">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-3 text-3xl font-semibold">Payment Status</h1>
                <p
                    className={`text-xl font-semibold leading-6 ${order.paymentStatus === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                >
                    {/* {order.paymentStatus} */}
                    Payment can only be done after the order is Approved.
                </p>
            </div>
        </div>
    );
};

export default OrderDetails;
