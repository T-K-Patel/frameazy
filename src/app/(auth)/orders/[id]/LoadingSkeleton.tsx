"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => {
    return (
        <>
            <section className="flex flex-col gap-y-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">Order Details</p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <b className="flex gap-11 text-black">
                        Order Id: <Skeleton className="h-8 w-20" />{" "}
                    </b>
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <b className="flex gap-5 text-black">
                        Order Date: <Skeleton className="h-8 w-20" />
                    </b>
                </p>
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold">Order Items</p>
                <ul className="flex flex-col gap-2 border-b border-[#F1F1F1]">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                </ul>
                <div className="flex justify-end gap-2 border-b border-[#F1F1F1] py-3">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                        <p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Discount</p>
                        <p className={`text-end font-semibold leading-6`}>
                            <Skeleton className="h-6 w-14" />
                        </p>
                        <p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
                        <p className={`text-end font-semibold leading-6`}>
                            <Skeleton className="h-6 w-14" />
                        </p>
                        <p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Package</p>
                        <p className={`text-end font-semibold leading-6`}>
                            <Skeleton className="h-6 w-14" />
                        </p>
                        <p className="mt-2 text-xl font-semibold leading-5 text-[#A3A1A1]">Total</p>
                        <p className={`mt-2 text-end text-xl font-bold leading-6`}>
                            <Skeleton className="h-6 w-14" />
                        </p>
                    </div>
                </div>
            </section>
            <section className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                    <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Order Status</p>
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                    <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Payment</p>
                    <Skeleton className="w-15 h-10" />
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                    <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Delivery Date</p>
                    <Skeleton className="w-15 h-10" />
                </div>
            </section>
            <section className="flex flex-col gap-y-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">Delivery Address</p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="w-30 h-8" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="w-30 h-8" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="w-30 h-8" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="w-30 h-8" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="w-30 h-8" />
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <Skeleton className="w-30 h-8" />
                </p>
            </section>
        </>
    );
};
