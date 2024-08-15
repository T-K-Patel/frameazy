"use client";
import DropDown from "@/components/DropDown";
import { OrderStatus } from "@prisma/client";
import React from "react";

const OrderDetails = ({ params }: { params: { id: string } }) => {
    console.log(params);
    const order: any = {
        id: "1",
        discount: "10%",
        delivery_charge: "10$",
        packaging: "20$",
        status: OrderStatus.Processing,
        paymentStatus: "Pending",
        delivery_address: {
            name: "John Doe",
            addressL1: "123, 4th cross, 5th main",
            addressL2: "BTM Layout",
            pincode: "560068",
            state: "Karnataka",
        },
    }; //TODO server action for fetcching the order by giving the id
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-4">
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] font-semibold leading-6">Order Items</p>
                <ul className="flex flex-col gap-2 border-b border-[#F1F1F1]"></ul>
                <div className="flex flex-col items-end gap-2 border-b border-[#F1F1F1]">
                    <div className="grid grid-cols-2 gap-x-2">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Discount</p>
                        <p className={`font-semibold leading-6`}>{order.discount}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
                        <p className={`font-semibold leading-6`}>{order.delivery_charge}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Package</p>
                        <p className={`font-semibold leading-6`}>{order.packaging}</p>
                    </div>
                </div>
                <div className="flex w-full flex-col items-end align-middle">
                    <div className="grid grid-cols-2 gap-x-2">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Total</p>
                        <p className={`text-lg font-bold leading-6`}>400$</p>
                    </div>
                </div>
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] font-semibold leading-6">Update Order Status</p>
                <DropDown items={Object.keys(OrderStatus)} value={order.status} onChange={() => {}} />
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] font-semibold leading-6">Payment</p>
                <p
                    className={`text-lg font-semibold ${order.paymentStatus === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                >
                    {order.paymentStatus}
                </p>
            </section>
            <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 font-semibold leading-6">Delivery Status</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order.delivery_address.name}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order.delivery_address.addressL1}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order.delivery_address.addressL2}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order.delivery_address.pincode}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order.delivery_address.state}</p>
            </section>
        </div>
    );
};

export default OrderDetails;
