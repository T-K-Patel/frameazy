import React from "react";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import RazorpayLogo from "@/assets/Razorpay_logo.svg";

export const Cart = () => {
    const [cartItems, onAdd, onRemove] = [
        [
            {
                id: "string",
                productName: "Product Name",
                productImage: "helloimage",
                productPrice: 983,
                qty: 5,
            },
        ],
        () => {},
        () => {},
    ];
    return (
        <div className="mx-auto flex w-[89%] flex-col gap-6 xl:flex-row">
            <div className="flex-1 rounded-2xl border border-solid border-[#f1f1f1] px-8 pb-14">
                <div className="py-10">
                    <h2 className="mb-5 text-3xl font-semibold">My Cart</h2>
                    <div className="h-[1px] w-full bg-[#f1f1f1]" />
                </div>
                {cartItems.length === 0 && <p className="font-semi-bold text-center text-2xl">Your cart is empty!</p>}
                <div className="flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} onAdd={onAdd} onRemove={onRemove} />
                    ))}
                </div>
                <button className="mt-10 px-6 py-4 text-xl font-semibold">Cancel Orders</button>
            </div>
            <div className="w-[425px]">
                <h1 className="mb-2 text-3xl font-semibold">Payment Details</h1>
                <p>Complete your purchase item by providing your payment details order.</p>
                <form action="" className="mt-5 flex flex-col gap-5">
                    <div>
                        <h1 className="mb-3 text-xl font-semibold">Select Payment Method</h1>
                        <label className="flex items-center justify-start gap-3 rounded-xl border border-gray-500 p-4">
                            <input
                                type={"radio"}
                                placeholder={"John Doe"}
                                name={"payment-method"}
                                value={"RazorPay"}
                                required
                                className={`remove-arrow rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                            />
                            <span className="lg:text-xl">
                                <Image src={RazorpayLogo} alt="Razorpay" className="h-8 w-min" />
                            </span>
                        </label>
                    </div>
                    <hr />
                    {/* <label className="flex flex-col">
                        <span className="font-semibold lg:text-xl pb-2">Name On Card</span>
                        <input
                            type={"text"}
                            placeholder={"John Doe"}
                            name={"name-on-card"}
                            className={`remove-arrow border border-solid border-[#D2D1D1] rounded-xl h-[60px] px-5 py-4 focus:outline-none`}
                        />
                    </label>
                     <label className="flex flex-col">
                        <span className="font-semibold lg:text-xl pb-2">Card Details</span>
                        <input
                            type={"text"}
                            placeholder={"1234 1234 1234 1234"}
                            name={"name-on-card"}
                            className={`remove-arrow border border-solid border-[#D2D1D1] rounded-t-xl h-[60px] px-5 py-4 focus:outline-none`}
                        />
                        <div className="grid grid-cols-2">
                            <input
                                type={"text"}
                                placeholder={"MM/YYYY"}
                                name={"name-on-card"}
                                className={`remove-arrow border border-solid border-[#D2D1D1] rounded-bl-xl h-[60px] px-5 py-4 focus:outline-none`}
                            />
                            <input
                                type={"text"}
                                placeholder={"CVV"}
                                name={"name-on-card"}
                                className={`remove-arrow border border-solid border-[#D2D1D1] rounded-br-xl h-[60px] px-5 py-4 focus:outline-none`}
                            />

                        </div>
                    </label> */}
                    <div className="rounded-xl border border-solid border-[#D2D1D1] p-3">
                        <h3 className="pb-3 text-2xl font-semibold">Order Summary</h3>
                        <hr />
                        <div className="flex flex-col gap-3 py-3 font-semibold">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Discount</p>
                                <span>$00.0</span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Delivery</p>
                                <span>$00.0</span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Package</p>
                                <span>$1000.0</span>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Total</p>
                                <span>$1000.0</span>
                            </div>
                        </div>
                    </div>
                    <Button size={"sm"} className="w-full py-3 text-lg">
                        Pay $1000.0
                    </Button>
                </form>
            </div>
        </div>
    );
};
