"use client";
import DropDown from "@/components/DropDown"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import { BiX } from "react-icons/bi";
import FrameCanvas from "../FrameCanvas";

type CustomizeOptionsProps = {
    title: string;
    items: string[];
};

const matOptions = ["White Mat"];
const matWidths = ["3"];

type ContentType = { title: string; warning: string; mat: boolean; options: CustomizeOptionsProps[] };

function Page() {
    const { frameOptions } = useFrames();

    if (frameOptions.framingStyle != "emptyFrame") return <></>;
    let customizeOptions = frameOptions.data.frameType;
    let content: ContentType = {
        title: "Empty frame for paper items",
        warning:
            "Important! The opening will be cut exactly as typed. we recommend making opening smaller than art size so it does not fall through cutout",
        mat: true,
        options: [
            {
                title: "Glazing",
                items: ["Regular"],
            },
            {
                title: "Frame",
                items: ["0.75 inch black frame"],
            },
        ],
    };

    if (customizeOptions === "canvas|panel") {
        content = {
            title: "Empty frame for canvas or panel",
            warning: "Important! As shown, the frame will be cut to leave 3/8” between your subject and the floater.",
            mat: false,
            options: [
                {
                    title: "Frame",
                    items: ["0.75 inch black frame"],
                },
            ],
        };
    }

    return (
        <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
            <FrameCanvas />
            <div className="mx-auto flex w-11/12 flex-col gap-6">
                <h1 className="leading-auto text-3xl font-semibold">{content.title}</h1>
                <div className="mb-3 flex flex-col gap-y-5">
                    <div className="flex gap-3 rounded-lg bg-yellow-300 p-3 px-5">
                        <BiX className="flex-shrink-0" />
                        <p className="text-justify">{content.warning}</p>
                    </div>
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
                                    />
                                    <p>X</p>
                                    <Input
                                        type="number"
                                        min={1}
                                        step={1}
                                        className="w-20 border border-gray-2 p-3 px-2 text-center"
                                        placeholder="0"
                                    />
                                    <span className="pr-2 font-semibold">In</span>
                                </div>
                            }
                        />
                        {content.mat && (
                            <InputField
                                label={<strong>Mat</strong>}
                                field={
                                    <div>
                                        <div className="mb-3 grid w-full items-center gap-4 md:grid-cols-2">
                                            <div className="flex items-center gap-x-2">
                                                <p className="">Total width:</p>
                                                <DropDown value={"Something"} onChange={(status: string) => { }} items={matOptions} />
                                                <span>
                                                    <strong>In</strong>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-x-2">
                                                <p>Top:</p>
                                                <DropDown value={"Something"} onChange={(status: string) => { }} items={matOptions} />
                                            </div>
                                        </div>
                                        <button className="text-blue-1">Add More Mat</button>
                                    </div>
                                }
                            />
                        )}
                        <div className="flex flex-col gap-y-5">
                            {content.options.map((option, index) => {
                                return (
                                    <InputField
                                        key={index}
                                        label={<strong>{option.title}</strong>}
                                        field={
                                            <DropDown value={"Something"} onChange={(status: string) => { }} items={option.items} />
                                        }
                                    />
                                );
                            })}
                            <InputField label={<strong>Printing</strong>} field={<span>No Printing</span>} />
                        </div>
                        <InputField
                            label={<strong>Total Size</strong>}
                            field={
                                <p>
                                    <span>13</span> <span>X</span> <span>13</span>{" "}
                                    <span className="font-semibold">In</span>
                                </p>
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
    );
}

export default Page;
