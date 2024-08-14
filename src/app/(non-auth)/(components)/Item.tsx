"use client";
import React from "react";
import Frame from "@/assets/frame-1.png";
import { BsCart3 } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FrameDataType, PopularFrameDataType } from "@/serverActions/frames/frame.action";
import { getImagePlaceholder } from "@/components/imagePlaceholder";

function Item({ item }: { item: FrameDataType | PopularFrameDataType }) {
    return (
        <div className="mx-auto w-fit rounded-2xl border border-solid p-3">
            <div className="flex items-center justify-center">
                <Image
                    src={item.image}
                    width={300}
                    height={400}
                    alt="frame"
                    placeholder="blur"
                    blurDataURL={getImagePlaceholder()}
                    className="aspect-[3/4] w-full max-w-64 object-contain"
                />
            </div>
            <h2 className="mt-3 text-xl">{item.name}</h2>
            <p className="mb-5">{item.unit_price}</p>
            <form className="flex gap-5">
                {/* // TODO: Change this implementation to handle disabling button */}
                <Button
                    size={"sm"}
                    formAction={async () => null}
                    // formAction={async () => await addCartItemAction({ frameId: item.id, image: "", quantity: 1, userId: "" })}
                    className="h-min w-min border border-transparent px-4 py-3 text-xl font-semibold transition-all duration-200 active:scale-90"
                >
                    <BsCart3 size={24} />
                    Add to cart
                </Button>
                <Button
                    size={"sm"}
                    variant={"outline"}
                    type="button"
                    className="h-min w-min border border-black bg-transparent px-4 py-3 text-lg font-semibold text-black transition-all duration-200 active:scale-90"
                >
                    <AiFillEdit size={24} />
                </Button>
            </form>
        </div>
    );
}

Item.defaultProps = { item: { id: "helloid", name: "Item", price: 500, image: Frame.src } };

export function FrameLoading() {
    return (
        <div className="mx-auto w-fit rounded-2xl border border-solid p-3 blur-[1px]">
            <div className="flex items-center justify-center">
                <Image
                    src={getImagePlaceholder()}
                    width={Frame.blurWidth! * 2}
                    height={Frame.blurHeight! * 2}
                    placeholder="blur"
                    blurDataURL={getImagePlaceholder()}
                    alt="frame"
                    className="aspect-[3/4] w-full max-w-64"
                />
            </div>
            <h2 className="mt-3 text-xl"> </h2>
            <p className="mb-5"> </p>
            <div className="flex gap-5">
                <Button
                    size={"sm"}
                    onClick={() => { }}
                    disabled
                    className="h-min w-min border border-transparent px-4 py-3 text-xl font-semibold transition-all duration-200 active:scale-90"
                >
                    <BsCart3 size={24} />
                    Add to cart
                </Button>
                <Button
                    size={"sm"}
                    disabled
                    onClick={() => { }}
                    variant={"outline"}
                    className="h-min w-min border border-black bg-transparent px-4 py-3 text-lg font-semibold text-black transition-all duration-200 active:scale-90"
                >
                    <AiFillEdit size={24} />
                </Button>
            </div>
        </div>
    );
}

export default Item;
