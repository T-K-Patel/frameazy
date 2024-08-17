"use client";
import DropDown from "@/components/DropDown";
import { OrderStatus } from "@prisma/client";
import Image from "next/image";
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
        customization: {
            type: "ImageCanvasPrint",
            printing: "Canvas",
            stretching: "Gallery",
            sides: "Image Wrap",
            width: 10,
            height: 10,
            mat: [
                { width: 2, colour: "#000000" },
                { width: 3, colour: "#FFFFFF" },
            ],
        },
        frame: {
            name: "Frame",
            image: "",
        },
        quantity: 1,
        price: 100,
    }; //TODO server action for fetcching the order by giving the id
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-4">
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold">Order Items</p>
                <ul className="flex flex-col gap-2 border-b border-[#F1F1F1]">
                    <div className="flex flex-col gap-1">
                        <div className="grid grid-cols-4 items-center gap-3 border-b border-[#F1F1F1] p-3 text-center">
                            <Image
                                src={order.frame.image}
                                width={100}
                                height={100}
                                alt={order.frame.name}
                                className="h-10 w-20"
                            />
                            <p className="text-xl font-semibold leading-6">
                                {order.frame.name},
                                <p className="text-base text-[#A3A1A1]">{order.customization.type}</p>
                            </p>
                            <p className="font-semibold leading-6 text-[#A3A1A1]">{order.quantity}x</p>
                            <p className="font-semibold leading-6">{order.price}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-2 border-b border-[#F1F1F1] p-5">
                            {Object.keys(order.customization).map((key) => {
                                if (
                                    key === "type" ||
                                    key === "image" ||
                                    key == "mat" ||
                                    key == "width" ||
                                    key == "height"
                                )
                                    return null;
                                return (
                                    <p>
                                        <b>{key}: </b>
                                        {order.customization[key]
                                            .replace(/_/g, " + ")
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                    </p>
                                );
                            })}
                            <p>
                                <b>Dimensions: </b>
                                {order.customization.width.toFixed(2)}x{order.customization.height.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-10 p-5">
                            <b className="pb-7">Mat: </b>
                            {order.customization.mat.map((mat: any) => {
                                return (
                                    <div className="flex flex-col items-center gap-2 text-center">
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
                </ul>
                <div className="flex flex-col items-end gap-2 border-b border-[#F1F1F1]">
                    <div className="grid grid-cols-2 gap-x-5">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Discount</p>
                        <p className={`font-semibold leading-6`}>{order.discount}</p>
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
                        <p className={`font-semibold leading-6`}>{order.delivery_charge}</p>
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Package</p>
                        <p className={`font-semibold leading-6`}>{order.packaging}</p>
                    </div>
                </div>
                <div className="flex w-full flex-col items-end align-middle">
                    <div className="grid grid-cols-2 gap-x-2">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1]">Total</p>
                        {/* <p className={`text-lg font-bold leading-6`}>{Math.round((order.quantity * (order.single_unit_price || 0)) * 10) / 10}</p> */}
                    </div>
                </div>
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Update Order Status</p>
                <DropDown items={Object.keys(OrderStatus)} value={order.status} onChange={() => {}} />
            </section>
            <section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] text-2xl font-semibold leading-6">Payment</p>
                <p
                    className={`text-lg font-semibold ${order.paymentStatus === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                >
                    {order.paymentStatus}
                </p>
            </section>
            <section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
                <p className="border-b border-[#F1F1F1] pb-2 text-2xl font-semibold leading-6">Delivery Address</p>
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
