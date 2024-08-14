import { IoIosClose } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import CartImage from "@/assets/cart.svg";
import Image from "next/image";
import React from "react";
import { CartItemType, deleteCartItem, updateCartItemQty } from "@/serverActions/cart/cart.actions";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
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
        <div className="flex flex-wrap items-center justify-between rounded-xl border border-solid border-[#f1f1f1] p-2">
            <div className="flex items-center gap-5">
                <Image
                    src={item.frame?.image || CartImage}
                    alt="frame"
                    width={512}
                    height={512}
                    placeholder="blur"
                    blurDataURL={getImagePlaceholder(80, 80)}
                    className="aspect-square w-10 flex-shrink-0 rounded-lg border border-black object-contain md:w-20"
                />
                <p className="leading-auto w-[75%] flex-shrink-0 text-sm font-semibold md:text-base">
                    {item.frame?.name}
                </p>
            </div>
            <div className="flex items-center justify-between gap-5 md:gap-8">
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
                <p className="text-end font-semibold"> &#8377; {(item.single_unit_price || 0) * item.quantity}</p>
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
        </div>
    );
};
