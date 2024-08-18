"use client";
import React from "react";
import DropDown from "@/components/DropDown";
import { OrderStatus } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const LoadingSkeleton = () => {
    return (
        <>
            <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">User</p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <b className="text-black">
                        Name: <Skeleton className="h-5 w-10" />{" "}
                    </b>
                </p>
                <p className="text-md font-semibold text-[#A3A1A1]">
                    <b className="text-black">
                        Email: <Skeleton className="h-5 w-10" />
                    </b>
                </p>
            </section>
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
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Update Order Status</p>
                <DropDown items={Object.keys(OrderStatus)} value={""} onChange={() => {}} />
                <Button disabled={true}>Update</Button>
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
