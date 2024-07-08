import React from "react";
import Frame from "@/assets/frame-1.png";
import { BsCart3 } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Item = () => {
    return (
        <div className="mx-auto w-fit rounded-2xl border border-solid p-3">
            <div className="flex items-center justify-center">
                <Image src={Frame} alt="frame" className="aspect-[3/4]" />
            </div>
            <h2 className="mt-3 text-xl">Name</h2>
            <p className="mb-5">Price</p>
            <div className="flex gap-5">
                <Button
                    size={"sm"}
                    className="h-min w-min border border-transparent px-4 py-3 text-xl font-semibold transition-all duration-200 active:scale-90"
                >
                    <BsCart3 size={24} />
                    Add to cart
                </Button>
                <Button
                    size={"sm"}
                    variant={"outline"}
                    className="h-min w-min border border-black bg-transparent px-4 py-3 text-lg font-semibold text-black transition-all duration-200 active:scale-90"
                >
                    <AiFillEdit size={24} />
                </Button>
            </div>
        </div>
    );
};

export default Item;
