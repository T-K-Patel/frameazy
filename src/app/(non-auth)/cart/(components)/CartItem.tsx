import { IoIosClose } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import Image from "next/image";
import React from "react";
import { Customization } from "@prisma/client";
import { CartItemType, deleteCartItem, updateCartItemQty } from "@/serverActions/cart/cart.actions";
import { Button } from "@/components/ui/button";

export type CartItemCompType = {
    item: CartItemType;
    // eslint-disable-next-line no-unused-vars
    updateState: (qty: number, itemId: string) => void;
    // eslint-disable-next-line no-unused-vars
    deleteItem: (itemId: string) => void;
    fetchCartItems: () => void;
};
export const CartItem = ({ item, updateState, deleteItem, fetchCartItems }: CartItemCompType) => {
    const [qty, setQty] = React.useState<number>(item.quantity);
    const [updating, setUpdating] = React.useState<boolean>(false);

    function updateQtyState(qt: number) {
        if (qty + qt < 1) return;
        if (!updating) setQty((q) => q + qt);
    }

    React.useEffect(() => {
        setQty(item.quantity);
    }, [item.quantity]);

    React.useEffect(() => {
        async function updateQty() {
            if (qty !== item.quantity) {
                setUpdating(true);
                const updatedData = await updateCartItemQty(qty, item.id);
                if (updatedData.success) {
                    updateState(updatedData.data, item.id);
                } else {
                    fetchCartItems();
                }
                setUpdating(false);
            }
        }
        const timeout = setTimeout(updateQty, 500);
        return () => clearTimeout(timeout);
    }, [qty, item.id, item.quantity, updateState, fetchCartItems]);

    return (
        <div className="flex flex-col gap-1 rounded-lg border border-[#F1F1F1]" key={item.id}>
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
                    <p className="w-full text-start text-base text-[#A3A1A1]">{item.customization.type}</p>
                </div>
                <p className="font-semibold leading-6 md:text-lg">{item.single_unit_price}</p>
                <div className="flex items-center justify-between gap-[1px] rounded-lg bg-blue-1 text-white md:gap-1">
                    <>
                        <button
                            className="flex w-full items-center p-1 disabled:bg-white disabled:bg-opacity-20 md:p-2"
                            disabled={updating}
                            onClick={updateQtyState.bind(null, -1)}
                        >
                            <FaMinus size={16} />
                        </button>
                    </>
                    <p className="w-auto px-[2px] text-center text-sm md:px-2 md:text-base">{qty}</p>
                    <>
                        <button
                            className="flex w-full items-center p-1 disabled:bg-white disabled:bg-opacity-20 md:p-2"
                            disabled={updating}
                            onClick={updateQtyState.bind(null, 1)}
                        >
                            <FaPlus size={16} />
                        </button>
                    </>
                </div>
                <p className="font-semibold leading-6 md:text-lg">{item.single_unit_price * item.quantity}</p>
                <>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={async () => {
                            setUpdating(true);
                            const deletData = await deleteCartItem(item.id);
                            if (deletData.success) {
                                deleteItem(item.id);
                            } else {
                                fetchCartItems();
                            }
                            setUpdating(false);
                        }}
                        disabled={updating}
                    >
                        <IoIosClose size={24} />
                    </Button>
                </>
            </div>
            <div className="flex flex-wrap justify-start gap-2 border-b border-[#F1F1F1] p-2">
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
                            <p key={key} className="flex-shrink-0 flex-grow" style={{ flexBasis: "200px" }}>
                                <b className="capitalize">{key}: </b>
                                {item.customization[key]
                                    .replace(/_/g, " + ")
                                    .replace(/([A-Z])/g, " $1")
                                    .trim()}
                            </p>
                        );
                    }
                    return <></>;
                })}
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
                            <div className="flex flex-col items-center gap-2 text-center" key={ind}>
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
};
