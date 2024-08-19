"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { Customization, Mirror } from "@prisma/client";
import { getFramesForCustomizatinAction, FramesForCustomizationType } from "@/serverActions/frames/frame.action";
import { useFrames } from "@/context/frames-context";
import Image from "next/image";
import { addCartItemAction } from "@/serverActions/cart/addCartItem.action";
import AddToCartDialog from "../AddToCartDialog";
import { useRouter } from "next/navigation";

const MirrorOptions: string[] = Object.keys(Mirror);

type MirrorOptions = {
    dimensions: { width: number; height: number };
    mirrorType: Mirror;
};
const Page = () => {
    const [mirror, setMirror] = useState<MirrorOptions>({
        dimensions: { width: 12, height: 9 },
        mirrorType: MirrorOptions[0] as Mirror,
    });
    const { frameOptions, customizingFrame, setCustomizingFrame } = useFrames();
    const [frames, setFrames] = useState<FramesForCustomizationType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (frameOptions.framingStyle == "mirrorFrame") {
            getFramesForCustomizatinAction()
                .then((data) => {
                    if (data.success) setFrames(data.data);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }, [frameOptions]);

    if (frameOptions.framingStyle != "mirrorFrame") return <></>;
    const addToCart = (qty: number) => {
        const data: Omit<Customization, "id"> = {
            type: "FramedMirror",
            width: mirror.dimensions.width,
            height: mirror.dimensions.height,
            image: null,
            mirror: mirror.mirrorType,
            glazing: null,
            printing: null,
            backing: null,
            stretching: null,
            sides: null,
            mat: [],
        };

        if (!data.mirror) {
            setError("Please select mirror type");
            return;
        }

        setAddingToCart(true);
        addCartItemAction(data, {
            frameId: customizingFrame ? customizingFrame.id : "",
            qty,
        })
            .then((data) => {
                if (data.success) {
                    console.log("Added to cart");
                    router.push("/cart");
                } else {
                    setError(data.error);
                }
            })
            .catch((error) => {
                console.log(error);
                setError("Something went wrong");
            });
    };

    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <FrameCanvas
                    totalSize={mirror.dimensions}
                    frameBorder={
                        customizingFrame
                            ? {
                                  borderWidth: customizingFrame.borderWidth || 0,
                                  src: customizingFrame.borderSrc || "",
                              }
                            : undefined
                    }
                />
                <div className="mx-auto flex w-11/12 flex-col gap-6">
                    <h1 className="leading-auto text-3xl font-semibold">Framed mirror</h1>
                    <div className="mb-3 flex flex-col gap-y-5">
                        <div className="flex flex-col gap-y-8">
                            <InputField
                                label={<strong>Size</strong>}
                                field={
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            min={(customizingFrame?.borderWidth || 1 / 3) * 3}
                                            step={1}
                                            className="w-20 border border-gray-2 p-3 px-2 text-center"
                                            placeholder="0"
                                            value={mirror.dimensions.width}
                                            onChange={(e) => {
                                                setMirror({
                                                    ...mirror,
                                                    dimensions: {
                                                        ...mirror.dimensions,
                                                        width: parseInt(e.target.value),
                                                    },
                                                });
                                            }}
                                        />
                                        <p>X</p>
                                        <Input
                                            type="number"
                                            min={(customizingFrame?.borderWidth || 1 / 3) * 3}
                                            step={1}
                                            className="w-20 border border-gray-2 p-3 px-2 text-center"
                                            placeholder="0"
                                            value={mirror.dimensions.height}
                                            onChange={(e) => {
                                                setMirror({
                                                    ...mirror,
                                                    dimensions: {
                                                        ...mirror.dimensions,
                                                        height: parseInt(e.target.value),
                                                    },
                                                });
                                            }}
                                        />
                                        <span className="pr-2 font-semibold">In</span>
                                    </div>
                                }
                            />
                            <InputField
                                label={<strong>Frame</strong>}
                                field={
                                    <FrameDropdown
                                        items={frames.map((frame) => {
                                            return {
                                                value: frame.id,
                                                label: (
                                                    <div className="flex gap-3" key={frame.name}>
                                                        <Image
                                                            src={frame.borderSrc}
                                                            width={100}
                                                            height={50}
                                                            alt="frame"
                                                            className="max-w-28 object-cover"
                                                        />
                                                        <div>
                                                            <p>{frame.name}</p>
                                                            <p>
                                                                <small>
                                                                    Price per inch: {frame.unit_price}{" "}
                                                                    <strong>&#8377;</strong>
                                                                </small>
                                                            </p>
                                                            <p>
                                                                <small>
                                                                    Border Thickness: {frame.borderWidth}{" "}
                                                                    <strong>In</strong>
                                                                </small>
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            };
                                        })}
                                        value={
                                            customizingFrame || {
                                                id: "",
                                                borderSrc: "",
                                                name: "",
                                                unit_price: 0,
                                                borderWidth: 0,
                                            }
                                        }
                                        onChange={(frameId: string) => {
                                            const selectedFrame = frames.find((frame) => frame.id === frameId);
                                            setCustomizingFrame(() => ({
                                                id: frameId,
                                                borderWidth: selectedFrame?.borderWidth || 0,
                                                borderSrc: selectedFrame?.borderSrc || "",
                                                name: selectedFrame?.name || "",
                                                unit_price: selectedFrame?.unit_price || 0,
                                            }));
                                        }}
                                    />
                                }
                            />
                            <InputField
                                label={<strong>Mirror type</strong>}
                                field={
                                    <DropDown
                                        value={mirror.mirrorType}
                                        onChange={(status: Mirror) => {
                                            setMirror({ ...mirror, mirrorType: status });
                                        }}
                                        items={MirrorOptions}
                                    />
                                }
                            />
                        </div>
                        {error && (
                            <div className="flex flex-col gap-y-2">
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}
                        <div className="grid items-center gap-4 md:grid-cols-2">
                            <div className="grid justify-between max-md:grid-cols-3 md:flex">
                                <span>
                                    <strong>Price</strong>
                                </span>
                                <span className="text-2xl font-bold max-md:col-span-2">$ 2,00.00</span>
                            </div>
                            <div>
                                <AddToCartDialog addToCart={addToCart} addingToCart={addingToCart} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
