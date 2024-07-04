import React from "react";
import Frame from "@/assets/frame-1.png";
import { BsCart3 } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Item = () => {
    return (
        <div className="w-fit rounded-2xl border border-solid p-3">
            <div className="flex items-center justify-center">
                <Image src={Frame} alt="frame" />
            </div>
            <h2 className="mt-5 text-2xl">Name</h2>
            <p className="mb-8">Price</p>
            <div className="flex gap-5">
                <Button
                    size={"sm"}
                    variant={"light"}
                    className="h-min w-min border border-black bg-transparent px-8 py-4 text-xl font-semibold text-black transition-all duration-200 active:scale-90"
                >
                    <BsCart3 />
                    Add to cart
                </Button>
                <Button
                    size={"sm"}
                    className="h-min w-min border border-transparent px-8 py-4 text-xl font-semibold transition-all duration-200 active:scale-90"
                >
                    <AiFillEdit size={24} />
                </Button>
                {/* <button className="py-4 px-7 text-dark-blue border border-solid rounded-lg border-dark-blue hover:bg-dark-blue hover:text-white">
                    <AiFillEdit size={24} />
                </button> */}
            </div>
        </div>
    );
};

export default Item;
