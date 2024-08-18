"use client";
import DropDown from "@/components/DropDown";
import { OrderStatus, Customization, Order } from "@prisma/client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getOrderDetailsAction, updateOrderStatusAction } from "@/serverActions/admin/admin.action";

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const OrderDetails = ({ params }: { params: { id: string } }) => {
    const [order, setOrder] = useState<Order>({
        id: "",
        order_items: [],
        discount: 0,
        delivery_charge: 0,
        packaging: 0,
        transaction_status: "Pending",
        delivery_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        order_status: OrderStatus.Received,
        shipping_address: {
            name: "",
            addressL1: "",
            addressL2: "",
            pincode: "",
            state: "",
            phone: "",
            city: "",
        },
    });

    useEffect(() => {
        getOrderDetailsAction(params.id)
            .then((data) => {
                if (data.success) setOrder(data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    });
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-4">
            <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">User</p>
                <p className="text-md font-semibold text-[#A3A1A1]"><b className="text-black">Name: </b>{order?.user.name}</p>
                <p className="text-md font-semibold text-[#A3A1A1]"><b className="text-black">Email: </b>{order?.user.email}</p>
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold">Order Items</p>
                <ul className="flex flex-col gap-2 border-b border-[#F1F1F1]">
                    {order?.order_items.map((item) => {
                        return (
                            <div className="flex flex-col gap-1" key={item.id}>
                                <div className="grid grid-cols-4 items-center gap-3 border-b border-[#F1F1F1] p-3 text-center">
                                    {item.frame && (
                                        <>
                                            <Image
                                                src={item.frame?.image!}
                                                width={100}
                                                height={100}
                                                alt={item.frame?.name!}
                                                className="h-10 w-20"
                                            />
                                            <p className="text-xl font-semibold leading-6">
                                                {item.frame.name},
                                                <p className="text-base text-[#A3A1A1]">{item.customization.type}</p>
                                            </p>
                                        </>
                                    )}
                                    <p className="font-semibold leading-6 text-[#A3A1A1]">{item.quantity}x</p>
                                    <p className="font-semibold leading-6">{item.single_unit_price}</p>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-2 border-b border-[#F1F1F1] p-5">
                                    {(Object.keys(item.customization) as (keyof Customization)[]).map((key) => {
                                        if (
                                            (key === "glazing" ||
                                                key === "backing" ||
                                                key == "stretching" ||
                                                key == "sides" ||
                                                key == "printing" ||
                                                key == "mirror") &&
                                            item.customization[key]
                                        ) {
                                            return (
                                                <p key={key}>
                                                    <b>{capitalizeFirstLetter(key)}: </b>
                                                    {item.customization[key]
                                                        .replace(/_/g, " + ")
                                                        .replace(/([A-Z])/g, " $1")
                                                        .trim()}
                                                </p>
                                            );
                                        }
                                        return <></>;
                                    })}
                                    <p>
                                        <b>Dimensions: </b>
                                        {item.customization.width.toFixed(2)}x{item.customization.height.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-10 p-5">
                                    <b className="pb-7">Mat: </b>
                                    {item.customization.mat.map((mat: any, ind: number) => {
                                        return (
                                            <div className="flex flex-col items-center gap-2 text-center" key={ind}>
                                                <div
                                                    className="h-5 w-5 overflow-hidden rounded-md border border-black"
                                                    style={{ backgroundColor: mat.colour }}
                                                ></div>
                                                <p className="font-semibold">{mat.width.toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </ul>
                <div className="flex flex-col items-end gap-2 border-b border-[#F1F1F1]">
                    <div className="grid grid-cols-2 gap-x-5">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Discount</p>
                        <p className={`font-semibold leading-6`}>{(order.discount / 100).toFixed(2)}</p>
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
                        <p className={`font-semibold leading-6`}>{(order.delivery_charge / 100).toFixed(2)}</p>
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Package</p>
                        <p className={`font-semibold leading-6`}>{(order.packaging / 100).toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex w-full flex-col items-end align-middle">
                    <div className="grid grid-cols-2 gap-x-5">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Total</p>
                        <p className={`text-lg font-bold leading-6`}>
                            {((order.delivery_charge + order.packaging - order.discount) / 100).toFixed(2)}
                        </p>
                    </div>
                </div>
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Update Order Status</p>
                <DropDown items={Object.keys(OrderStatus)} value={order?.order_status!} onChange={(status:OrderStatus) => {
                    updateOrderStatusAction(order.id, status).then((data) => {
                        if (data.success) setOrder({...order, order_status: status});                
                    }).catch((error)=>{
                        console.log(error);
                    });
                }} />
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Payment</p>
                <p
                    className={`text-lg font-semibold ${order?.transaction_status === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                >
                    {order?.transaction_status}
                </p>
            </section>
            <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">Delivery Address</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.name}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.addressL1}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.addressL2}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.pincode}</p>
                <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.state}</p>
            </section>
        </div>
    );
};

export default OrderDetails;
