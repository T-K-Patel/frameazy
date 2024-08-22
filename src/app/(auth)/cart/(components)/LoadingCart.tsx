import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function LoadingCart() {
    return (
        <section className="mx-auto my-5 max-w-screen-2xl">
            <div className="m-0 mx-auto grid w-11/12 max-w-full gap-6 p-0 lg:grid-cols-3">
                <div className="w-full rounded-2xl border border-solid border-[#f1f1f1] px-4 pb-14 lg:col-span-2">
                    <div className="py-10">
                        <h2 className="mb-5 text-3xl font-semibold">My Cart</h2>
                        <div className="h-[1px] w-full bg-[#f1f1f1]" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                        <Skeleton className="h-14 rounded-xl md:h-24" />
                    </div>
                    <div className="me-4 mt-10 flex flex-col items-end justify-end">
                        <Button variant={"destructive"} disabled={true}>
                            Clear Cart
                        </Button>
                    </div>
                </div>
                <div className="w-full">
                    <h1 className="mb-2 text-3xl font-semibold">Order Details</h1>
                    <p>Complete your purchase item by providing details.</p>
                    <div className="mt-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h1 className="mb-3 text-xl font-semibold">Shipping Address</h1>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Receiptant Name</span>
                                <Skeleton className="h-[60px] rounded-xl" />
                            </label>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Address Line 1</span>
                                <Skeleton className="h-[60px] rounded-xl" />
                            </label>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Address line 2</span>
                                <Skeleton className="h-[60px] rounded-xl" />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">City</span>
                                    <Skeleton className="h-[60px] rounded-xl" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">Pin Code</span>
                                    <Skeleton className="h-[60px] rounded-xl" />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">State</span>
                                    <Skeleton className="h-[60px] rounded-xl" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">Phone</span>
                                    <Skeleton className="h-[60px] rounded-xl" />
                                </label>
                            </div>
                        </div>
                        <hr />
                        <div className="">
                            <h1 className="mb-3 text-xl font-semibold">Payment Method</h1>
                            <Skeleton className="h-[60px] rounded-xl" />
                        </div>
                        <div className="rounded-xl border border-solid border-[#D2D1D1] p-3">
                            <h3 className="pb-3 text-2xl font-semibold">Order Summary</h3>
                            <hr />
                            <div className="flex flex-col gap-3 py-3 font-semibold">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Discount</p>
                                    <span className="flex">
                                        <Skeleton className="w-12" />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Delivery</p>
                                    <span className="flex">
                                        <Skeleton className="w-12" />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Package</p>
                                    <span className="flex">
                                        <Skeleton className="w-12" />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Total</p>
                                    <span className="flex">
                                        <Skeleton className="w-12" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button disabled={true}>Place Order</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoadingCart;
