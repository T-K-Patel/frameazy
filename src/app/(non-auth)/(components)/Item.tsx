"use client";
import React from "react";
import Frame from "@/assets/frame-1.png";
import { AiFillEdit } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { FrameDataType, PopularFrameDataType } from "@/serverActions/frames/frame.action";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import { Skeleton } from "@/components/ui/skeleton";
import { useFrames } from "@/context/frames-context";
import { Img } from "react-image";
import { cn } from "@/lib/utils";

function Item({ item, isPopularItem }: { item: FrameDataType | PopularFrameDataType; isPopularItem?: boolean }) {
    const { setDialogOpen, setCustomizingFrame } = useFrames();
    return (
        <>
            <div
                className={cn(
                    "mx-auto grid h-full w-full grid-cols-1 gap-3 rounded-2xl border border-solid px-2 pb-2 sm:w-fit md:grid-rows-1 md:p-3",
                    isPopularItem ? "max-w-72" : "max-md:grid-cols-9",
                )}
            >
                <div className={cn("flex items-center justify-center", isPopularItem ? "" : "max-md:col-span-3")}>
                    <Img
                        src={item.image}
                        width={300}
                        height={400}
                        alt="frame"
                        loader={<Img src={getImagePlaceholder()} />}
                        className={cn(
                            "h-auto w-full max-w-64 object-contain md:w-full",
                            isPopularItem ? "aspect-[3/4] w-full max-w-60 md:!w-60" : "",
                        )}
                    />
                </div>
                <div className={cn("mx-auto w-full max-w-64 align-baseline", isPopularItem ? "" : "max-md:col-span-6")}>
                    <h2
                        className={cn(
                            "mb-2 mt-3 md:text-2xl",
                            isPopularItem ? "text- w-full truncate text-nowrap" : "",
                        )}
                    >
                        {item.name}
                    </h2>
                    {"color" in item && (
                        <p className="items-center text-xs md:text-sm">
                            <b>Color: </b>
                            {item.color
                                .replace(/_/g, " + ")
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                        </p>
                    )}
                    {"category" in item && (
                        <p className="items-center text-xs md:text-sm">
                            <b>Category: </b>
                            {item.category
                                .replace(/_/g, " + ")
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                        </p>
                    )}
                    {"collection" in item && (
                        <p className="mb-2 items-center text-xs md:text-sm">
                            <b>Collection: </b>
                            {item.collection
                                .replace(/_/g, " + ")
                                .replace(/([A-Z])/g, " $1")
                                .trim()}{" "}
                        </p>
                    )}

                    <p className="md:text-md mb-2 text-sm md:mb-5">
                        <b>Price per inch: </b>₹ {(item.unit_price / 100).toFixed(2)}
                    </p>
                    <form>
                        <Button
                            size={"lg"}
                            variant={"outline"}
                            onClick={() => {
                                if ("borderSrc" in item && "borderWidth" in item) {
                                    setCustomizingFrame({
                                        borderSrc: item.borderSrc,
                                        borderWidth: item.borderWidth,
                                        id: item.id,
                                        name: item.name,
                                        unit_price: item.unit_price,
                                    });
                                    setDialogOpen(true);
                                }
                            }}
                            type="button"
                            className="h-min w-full border border-black bg-transparent px-2 py-2 font-semibold text-black transition-all duration-200 active:scale-90 md:px-4 md:py-3 md:text-lg"
                        >
                            Customise
                            <AiFillEdit size={24} className="ml-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

Item.defaultProps = { item: { id: "helloid", name: "Item", price: 500, image: Frame.src }, isPopularItem: false };

export function FrameLoading() {
    return (
        <div className="mx-auto w-fit rounded-2xl border border-solid p-3 blur-[1px]">
            <div className="mb-1 flex items-center justify-center">
                <Img
                    src={getImagePlaceholder()}
                    width={Frame.blurWidth! * 2}
                    height={Frame.blurHeight! * 2}
                    loader={<Img src={getImagePlaceholder()} />}
                    alt="frame"
                    className="aspect-[3/4] w-full max-w-64"
                />
            </div>
            <Skeleton className="mb-1 h-5 w-full" />
            <Skeleton className="mb-1 h-5 w-full" />
            <Skeleton className="mb-1 h-5 w-full" />
            <Skeleton className="mb-1 h-5 w-full" />
            <form className="flex gap-5">
                <Button
                    size={"lg"}
                    variant={"outline"}
                    type="button"
                    className="h-min w-full border border-black bg-transparent px-2 py-2 font-semibold text-black transition-all duration-200 active:scale-90 md:px-4 md:py-3 md:text-lg"
                >
                    Customise
                    <AiFillEdit size={24} className="ml-4" />
                </Button>
            </form>
        </div>
    );
}

export default Item;
