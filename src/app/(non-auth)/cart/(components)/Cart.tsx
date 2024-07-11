"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import RazorpayLogo from "@/assets/Razorpay_logo.svg";
import { useSession } from "next-auth/react";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import { CartItemType } from "@/serverActions/cart/cart.actions";

export const Cart = ({ cartItems: cI, error }: { cartItems: CartItemType[], error?: string }) => {
    const [cartItems, setCartItems] = useState(cI);
    const session = useSession();

    // LATER: Implement feature to fetch cart on pooling basis.

    const updateCartItemQty = useCallback(
        (quantity: number, itemId: string) => {
            const updatedData = cartItems.map((item) => {
                if (item.id === itemId) {
                    item.quantity = quantity;
                }
                return item;
            });
            setCartItems(updatedData);
        },
        [cartItems],
    );

    const deleteItem = useCallback(
        (itemId: string) => {
            const updatedData = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedData);
        },
        [cartItems],
    );

    return (
        <div className="m-0 mx-auto grid w-11/12 max-w-full gap-6 p-0 lg:grid-cols-3">
            <div className="w-full rounded-2xl border border-solid border-[#f1f1f1] px-4 pb-14 lg:col-span-2">
                <div className="py-10">
                    <h2 className="mb-5 text-3xl font-semibold">
                        {session?.data?.user.name ? session.data.user.name + "'s" : "My"} Cart
                    </h2>
                    <div className="h-[1px] w-full bg-[#f1f1f1]" />
                </div>
                {error ? <p className="font-semibold text-red-500 text-center text-2xl">{error}</p> :
                    cartItems.length === 0 && <p className="font-semi-bold text-center text-2xl">Your cart is empty!</p>}
                <div className="flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} updateState={updateCartItemQty} deleteItem={deleteItem} />
                    ))}
                </div>
                <button className="mt-10 px-6 py-4 text-xl font-semibold">Cancel Orders</button>
            </div>
            <div className="w-full">
                <h1 className="mb-2 text-3xl font-semibold">Payment Details</h1>
                <p>Complete your purchase item by providing your payment details order.</p>
                <form action="" className="mt-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <h1 className="mb-3 text-xl font-semibold">Shipping Address</h1>
                        <label className="flex flex-col">
                            <span className="pb-2 font-semibold lg:text-lg">Receiptant Name</span>
                            <input
                                type={"text"}
                                placeholder={"John Doe"}
                                name={"name"}
                                required
                                className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="pb-2 font-semibold lg:text-lg">Address Line 1</span>
                            <input
                                type={"text"}
                                placeholder={"123 Main St"}
                                required
                                name={"address-line-1"}
                                className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="pb-2 font-semibold lg:text-lg">Address line 2</span>
                            <input
                                type={"text"}
                                placeholder={"123 Main St"}
                                required
                                name={"address-line-2"}
                                className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">City</span>
                                <input
                                    type={"text"}
                                    placeholder={"New York"}
                                    required
                                    name={"city"}
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Pin Code</span>
                                <input
                                    type={"text"}
                                    placeholder={"100001"}
                                    required
                                    pattern="[0-9]{6}"
                                    name={"pin-code"}
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">State</span>
                                <input
                                    type={"text"}
                                    placeholder={"New York"}
                                    name={"state"}
                                    required
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Phone</span>
                                <input
                                    type={"text"}
                                    placeholder={"123-456-7890"}
                                    name={"phone"}
                                    required
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div className="">
                        <h1 className="mb-3 text-xl font-semibold">Payment Method</h1>
                        <label className="flex items-center justify-start gap-3 rounded-xl border border-gray-500 p-4">
                            {/* <input
                                type={"radio"}
                                placeholder={"John Doe"}
                                name={"payment-method"}
                                value={"RazorPay"}
                                required
                                className={`remove-arrow rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                            /> */}
                            <span className="lg:text-xl">
                                <Image
                                    src={RazorpayLogo}
                                    alt="Razorpay"
                                    placeholder="blur"
                                    blurDataURL={getImagePlaceholder(RazorpayLogo.width, RazorpayLogo.height)}
                                    className="h-8 w-min"
                                />
                            </span>
                        </label>
                    </div>
                    <div className="rounded-xl border border-solid border-[#D2D1D1] p-3">
                        <h3 className="pb-3 text-2xl font-semibold">Order Summary</h3>
                        <hr />
                        <div className="flex flex-col gap-3 py-3 font-semibold">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Discount</p>
                                <span>&#8377; 00.0</span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Delivery</p>
                                <span>&#8377; {cartItems.length * 5}</span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Package</p>
                                <span>
                                    &#8377;{" "}
                                    {(
                                        Math.round(
                                            cartItems.reduce(
                                                (acc, item) =>
                                                    acc + item.quantity * Math.floor(Math.random() * 100 + 25),
                                                0,
                                            ) * 10,
                                        ) / 10
                                    ).toLocaleString("en-in")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Total</p>
                                <span>
                                    &#8377;{" "}
                                    {(
                                        Math.round(
                                            cartItems.reduce(
                                                (acc, item) =>
                                                    acc + item.quantity * Math.floor(Math.random() * 100 + 25),
                                                0,
                                            ) * 10,
                                        ) /
                                        10 +
                                        cartItems.length * 5
                                    ).toLocaleString("en-in")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button size={"lg"} className="h-auto w-full py-3 text-lg">
                        Place order
                    </Button>
                </form>
            </div>
        </div>
    );
};
