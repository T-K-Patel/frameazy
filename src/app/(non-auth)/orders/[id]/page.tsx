"use client";
import { Customization } from "@prisma/client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getOrderDetailsAction, UserOrderDetails } from "@/serverActions/orders/orders.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IoMdOpen } from "react-icons/io";

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const LoadingComp = () => {
    return (
        <>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold">Order Items</p>
                <ul className="flex flex-col gap-2 border-b border-[#F1F1F1]">
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                </ul>
                <div className="flex flex-col items-end gap-2 border-b border-[#F1F1F1]">
                    <div className="grid grid-cols-2 gap-x-5">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Discount</p>
                        <p className={`font-semibold leading-6`}>
                            <Skeleton className="h-5 w-8" />
                        </p>
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
                        <p className={`font-semibold leading-6`}>
                            <Skeleton className="h-5 w-8" />
                        </p>
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Package</p>
                        <p className={`font-semibold leading-6`}>
                            <Skeleton className="h-5 w-8" />
                        </p>
                    </div>
                </div>
                <div className="flex w-full flex-col items-end align-middle">
                    <div className="grid grid-cols-2 gap-x-5">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Total</p>
                        <p className={`text-lg font-bold leading-6`}>
                            <Skeleton className="h-5 w-8" />
                        </p>
                    </div>
                </div>
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Order Status</p>
                <Skeleton className="w-30 h-10" />
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Payment</p>
                <Skeleton className="w-15 h-10" />
            </section>
            <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">Delivery Address</p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="h-8 w-10" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="h-8 w-10" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="h-8 w-10" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="h-8 w-10" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="h-8 w-10" />
                </p>
            </section>
        </>
    );
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
                <LoadingComp />
            ) : error ? (
                <p className="text-center text-2xl font-semibold text-red-500">{error ?? "No new orders"}</p>
            ) : (
                order && (
                    <>
                        <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                            <p className="items-center border-b border-[#F1F1F1] pb-3 text-2xl font-semibold">
                                Order Items
                            </p>
                            <ul className="flex flex-col gap-2 border-b border-[#F1F1F1]">
                                {order?.order_items.map((item) => {
                                    return (
                                        <div className="flex flex-col gap-1" key={item.id}>
                                            <div className="flex items-center gap-8 border-b border-[#F1F1F1] p-3 text-center">
                                                {item.frame && (
                                                    <>
                                                        <Image
                                                            src={item.frame?.image!}
                                                            width={100}
                                                            height={100}
                                                            alt={item.frame?.name!}
                                                            className="h-20 w-20 object-contain"
                                                        />
                                                        <p className="w-full text-start text-xl font-semibold leading-6">
                                                            {item.frame.name},
                                                            <p className="text-base text-[#A3A1A1]">
                                                                {item.customization.type}
                                                            </p>
                                                        </p>
                                                    </>
                                                )}
                                                <p className="font-semibold leading-6 text-[#A3A1A1] md:text-lg">
                                                    {item.quantity}x
                                                </p>
                                                <p className="font-semibold leading-6 md:text-lg">
                                                    {item.single_unit_price}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-2 border-b border-[#F1F1F1] p-2">
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
                                                    },
                                                )}
                                                <p>
                                                    <b>Dimensions: </b>
                                                    {item.customization.width.toFixed(2)}x
                                                    {item.customization.height.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-10 p-3">
                                                <b className="pb-7">Mat: </b>
                                                {item.customization.mat.map((mat: any, ind: number) => {
                                                    return (
                                                        <div
                                                            className="flex flex-col items-center gap-2 text-center"
                                                            key={ind}
                                                        >
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
                            <div className="flex justify-end gap-2 border-b border-[#F1F1F1]">
                                <div className="grid grid-cols-2 gap-x-10">
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
                            <p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">Payment</p>
                            <div className="flex justify-center gap-x-5">
                                {order?.order_status === "Received" ? (
                                    <p className={`text-lg font-semibold text-red-500`}>Not Approved yet</p>
                                ) : order.order_status == "Approved" ? (
                                    <>
                                        <Button size={"lg"}>
                                            Pay Now&nbsp;
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
                        <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                            <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Delivery by</p>
                            <p className={`text-lg font-semibold`}>{order?.delivery_date.toDateString()}</p>
                        </section>
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
