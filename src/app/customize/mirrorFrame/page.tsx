"use client";
import DropDown from "@/components/DropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import useDebounce from "@/lib/useDebounce";
import { Mirror } from "@prisma/client";
import { getFramesForCustomizatinAction, FramesForCustomizationType } from "@/serverActions/frames/frame.action";
import { useFrames } from "@/context/frames-context";

const MirrorOptions: string[] = Object.keys(Mirror);

type MirrorOptions = {
    dimensions: { width: number; height: number };
    frame: { src: string; borderWidth: number };
    mirrorType: string;
};
const Page = () => {
    const [mirror, setMirror] = useState<MirrorOptions>({
        dimensions: { width: 12, height: 9 },
        frame: { src: "0.75inch black frame", borderWidth: 0.75 },
        mirrorType: MirrorOptions[0],
    });
    const { frameOptions } = useFrames();
    const [frames, setFrames] = useState<FramesForCustomizationType[]>([]);
    const debouncedDimensions = useDebounce<{ width: number; height: number }>(mirror.dimensions, 300);

    useEffect(() => {
        if (frameOptions.framingStyle == "mirrorFrame") {
            getFramesForCustomizatinAction().then((data) => {
                if (data.success) setFrames(data.data);
            });
        }
    }, [frameOptions]);
    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <FrameCanvas totalSize={debouncedDimensions} frameBorder={mirror.frame} />
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
                                            min={1}
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
                                            min={1}
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
                                label={<strong>Mirror type</strong>}
                                field={
                                    <DropDown
                                        value={mirror.mirrorType}
                                        onChange={(status: string) => {
                                            setMirror({ ...mirror, mirrorType: status });
                                        }}
                                        items={MirrorOptions}
                                    />
                                }
                            />
                            <InputField
                                label={<strong>Frame</strong>}
                                field={
                                    <DropDown
                                        value={mirror.frame.src}
                                        onChange={(status: string) => {
                                            setMirror({ ...mirror, frame: { src: status, borderWidth: 1 } });
                                        }}
                                        items={frames.map((frame) => frame.borderSrc)}
                                        // items={frames}
                                    />
                                }
                            />
                        </div>
                        <div className="grid items-center gap-4 md:grid-cols-2">
                            <div className="grid justify-between max-md:grid-cols-3 md:flex">
                                <span>
                                    <strong>Price</strong>
                                </span>
                                <span className="text-2xl font-bold max-md:col-span-2">$ 2,00.00</span>
                            </div>
                            <Button size={"lg"} className="h-auto w-full py-4">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
