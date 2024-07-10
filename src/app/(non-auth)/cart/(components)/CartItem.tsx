import { IoIosClose } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import CartImage from "@/assets/cart.svg";
import Image from "next/image";

export type CartItemType = {
    item: {
        id: string;
        productName: string;
        productImage: string;
        productPrice: number;
        qty: number;
    };
};
export const CartItem = ({ item }: CartItemType) => {
    return (
        <div className="flex flex-wrap items-center justify-between rounded-xl border border-solid border-[#f1f1f1] p-2">
            <div className="flex items-center gap-5">
                <Image
                    src={item.productImage || CartImage}
                    alt="frame"
                    width={512}
                    height={512}
                    className="aspect-square w-10 flex-shrink-0 rounded-lg border border-black object-contain md:w-20"
                />
                <p className="flex-shrink-0 w-[75%] text-sm md:text-base font-semibold leading-auto">{item.productName}</p>
            </div>
            <div className="flex items-center justify-between gap-5 md:gap-8">
                <div className="flex items-center justify-between gap-[1px] md:gap-1 rounded-lg bg-blue-1 text-white">
                    <form>
                        <button
                            className="flex w-full items-center p-1 md:p-2 disabled:bg-white disabled:bg-opacity-20"
                            disabled={item.qty == 1}
                        >
                            <FaMinus size={16} />
                        </button>
                    </form>
                    <p className="w-auto px-[2px] md:px-2 text-center text-sm md:text-base ">{item.qty}</p>
                    <form>
                        <button
                            className="flex w-full items-center p-1 md:p-2 disabled:bg-white disabled:bg-opacity-20"
                            disabled={item.qty == 5}
                        >
                            <FaPlus size={16} />
                        </button>
                    </form>
                </div>
                <p className="text-end font-semibold">${item.productPrice * item.qty}</p>
                <IoIosClose size={24}/>
            </div>
        </div>
    );
};
