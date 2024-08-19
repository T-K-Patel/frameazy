"use client";
import { Customization } from "@prisma/client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getOrderDetailsAction, UserOrderDetails } from "@/serverActions/orders/orders.action";
import { Button } from "@/components/ui/button";
import { IoMdOpen } from "react-icons/io";
import { LoadingSkeleton } from "./LoadingSkeleton";

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const OrderDetails = ({ params }: { params: { id: string } }) => {
    const [order, setOrder] = useState<UserOrderDetails | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getOrderDetailsAction(params.id)
            .then((data) => {
                if (data.success) {
                    setOrder(data.data);
                    setError(null);
                } else {
                    setError(data.error);
                    setOrder(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setError("Something went wrong");
                setOrder(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [params.id]);
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-8 py-5">
            {loading ? (
                <LoadingSkeleton />
            ) : error ? (
                <p className="text-center text-2xl font-semibold text-red-500">{error ?? "No new orders"}</p>
            ) : (
                order && (
                    <>
                        <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                            <p className="p border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
                                Order Details
                            </p>
                            <p className="text-md py-3 font-semibold text-[#A3A1A1]">
                                <b className="pr-5 text-black">Order Id: </b>
                                {order.id}
                            </p>
                            <p className="text-md font-semibold text-[#A3A1A1]">
                                <b className="pr-5 text-black">Order Date: </b>
                                {order.createdAt.toLocaleString("en-in", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                })}
                            </p>
                        </section>
                        <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                            <p className="items-center border-b border-[#F1F1F1] pb-3 text-2xl font-semibold">
                                Order Items
                            </p>
                            <ul className="flex flex-col gap-2">
                                {order?.order_items.map((item) => {
                                    return (
                                        <div
                                            className="flex flex-col gap-1 rounded-lg border border-[#F1F1F1]"
                                            key={item.id}
                                        >
                                            <div className="flex items-center gap-8 border-b border-[#F1F1F1] p-3 text-center">
                                                {(item.frame?.image || item.customization.image) && (
                                                    <>
                                                        <Image
                                                            src={item.customization.image || item.frame?.image || ""}
                                                            width={100}
                                                            height={100}
                                                            alt={item.frame?.name || ""}
                                                            className="h-20 w-20 object-contain"
                                                        />
                                                    </>
                                                )}
                                                <div className="w-full">
                                                    <p className="w-full text-start text-xl font-semibold leading-6">
                                                        {item.frame?.name || "No Frame"}
                                                    </p>
                                                    <p className="w-full text-start text-base text-[#A3A1A1]">
                                                        {item.customization.type}
                                                    </p>
                                                </div>
                                                <p className="font-semibold leading-6 md:text-lg">
                                                    {item.single_unit_price}
                                                </p>
                                                <p className="font-semibold leading-6 text-[#A3A1A1] md:text-lg">
                                                    x{item.quantity}
                                                </p>
                                                <p className="font-semibold leading-6 md:text-lg">
                                                    {item.single_unit_price * item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap justify-start gap-2 border-b border-[#F1F1F1] p-2">
                                                {(Object.keys(item.customization) as (keyof Customization)[]).map(
                                                    (key) => {
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
                                                                <p
                                                                    key={key}
                                                                    className="flex-shrink-0 flex-grow"
                                                                    style={{ flexBasis: "200px" }}
                                                                >
                                                                    <b>{capitalizeFirstLetter(key)}: </b>
                                                                    {item.customization[key]
                                                                        .replace(/_/g, " + ")
                                                                        .replace(/([A-Z])/g, " $1")
                                                                        .trim()}
                                                                </p>
                                                            );
                                                        }
                                                        return <></>;
                                                    },
                                                )}
                                                <p className="flex-shrink-0 flex-grow" style={{ flexBasis: "200px" }}>
                                                    <b>Dimensions: </b>
                                                    {item.customization.width.toFixed(2)}&nbsp;x&nbsp;
                                                    {item.customization.height.toFixed(2)}{" "}
                                                    <strong>
                                                        In<sup>2</sup>
                                                    </strong>
                                                </p>
                                            </div>
                                            {item.customization.mat.length == 0 ? (
                                                <></>
                                            ) : (
                                                <div className="flex flex-wrap items-center gap-10 p-3">
                                                    <b className="pb-7">Mat: </b>
                                                    {item.customization.mat.map((mat: any, ind: number) => {
                                                        return (
                                                            <div
                                                                className="flex flex-col items-center gap-2 text-center"
                                                                key={ind}
                                                            >
                                                                <div
                                                                    title={mat.colour}
                                                                    className="h-5 w-5 overflow-hidden rounded-md border border-black"
                                                                    style={{ backgroundColor: mat.colour }}
                                                                ></div>
                                                                <p className="font-semibold">{mat.width.toFixed(2)}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </ul>
                            <div className="flex justify-end gap-2">
                                <div className="grid grid-cols-2 gap-x-10 py-3">
                                    <p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Discount</p>
                                    <p className={`text-end font-semibold leading-6`}>
                                        {(order.discount / 100).toFixed(2)}
                                    </p>
                                    <p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
                                    <p className={`text-end font-semibold leading-6`}>
                                        {(order.delivery_charge / 100).toFixed(2)}
                                    </p>
                                    <p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Package</p>
                                    <p className={`border-b border-[#A3A1A1] text-end font-semibold leading-6`}>
                                        {(order.packaging / 100).toFixed(2)}
                                    </p>
                                    <p className="mt-2 text-xl font-semibold leading-5 text-[#A3A1A1]">Total</p>
                                    <p className={`mt-2 text-end text-xl font-bold leading-6`}>
                                        ₹{((order.delivery_charge + order.packaging - order.discount) / 100).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </section>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                                <p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
                                    Order Status
                                </p>
                                <p
                                    className={`text-lg font-semibold ${order?.transaction_status === "Success" ? "text-[#008C0E]" : order?.transaction_status === "Pending" ? "text-[#D68D00]" : "text-red-500"}`}
                                >
                                    {order?.order_status}
                                </p>
                            </section>
                            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                                <p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
                                    Payment
                                </p>
                                <div className="flex gap-x-5">
                                    {order?.order_status === "Received" ? (
                                        <p className={`text-lg font-semibold text-red-500`}>Not Approved yet</p>
                                    ) : order.order_status == "Approved" ? (
                                        <>
                                            <Button size={"lg"}>
                                                Pay with Razorpay&nbsp;
                                                <IoMdOpen size={20} />
                                            </Button>
                                        </>
                                    ) : (
                                        <p
                                            className={`text-lg font-semibold ${order?.transaction_status === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                                        >
                                            {order?.transaction_status}
                                        </p>
                                    )}
                                </div>
                            </section>
                            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3 sm:col-span-2 lg:col-span-1">
                                <p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
                                    Delivery by
                                </p>
                                <p className={`text-lg font-semibold`}>
                                    {order?.delivery_date?.toDateString() || "Not Scheduled"}
                                </p>
                            </section>
                        </div>
                        <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                            <p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
                                Delivery Address
                            </p>
                            <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.name}</p>
                            <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.phone}</p>
                            <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.addressL1}</p>
                            <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.addressL2}</p>
                            <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.pincode}</p>
                            <p className="text-md font-semibold text-[#A3A1A1]">{order?.shipping_address.state}</p>
                        </section>
                    </>
                )
            )}
        </div>
    );
};

export default OrderDetails;
