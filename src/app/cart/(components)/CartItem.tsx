import { IoIosClose } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import CartImage from "@/assets/cart.svg";
import Image from "next/image";

type CartItemType = {
    item: {
        id: string;
        productName: string;
        productImage: string;
        productPrice: number;
        qty: number;
    };
    onAdd: (item: any) => void;
    onRemove: (item: any) => void;
};
export const CartItem = ({ item, onAdd, onRemove }: CartItemType) => {
    return (
        <div className="flex items-center justify-between rounded-xl border border-solid border-[#f1f1f1] p-5">
            <div className="flex items-center gap-8">
                <Image src={CartImage} alt="frame" className="h-20 w-[100px] bg-black object-contain" />
                <p className="text-2xl font-semibold">{item.productName}</p>
            </div>
            <div className="flex items-center gap-8">
                <div className="flex items-center justify-between gap-7 rounded-lg bg-blue-1 p-2 text-white">
                    <FaMinus
                        size={24}
                        // onClick={() => {
                        //     onRemove(item);
                        // }}
                    />
                    <p className="text-2xl">{item.qty}</p>
                    <FaPlus
                        size={24}
                        // onClick={() => {
                        //     onAdd(item);
                        // }}
                    />
                </div>
                <p className="text-2xl font-semibold">${item.productPrice * item.qty}</p>
                <IoIosClose size={40} />
            </div>
        </div>
    );
};
