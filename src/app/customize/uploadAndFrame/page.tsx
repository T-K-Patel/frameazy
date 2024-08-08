"use client";
import AddArtwork from "@/components/AddArtwork";
import DropDown from "@/components/DropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";

type CustomizeOptionsProps = {
    title: string;
    items: string[];
};

const matOptions = ["White Mat"];
const matWidths = ["3"];

type uploadOptionsProps = {
    dimensions: { width: number; height: number };
    frame?: string;
    glazing?: string;
    printing:string;
    backing?:string;
    stretching?:string;
    sides?:string;
}
type matOptionsProps = {
    width: number;
    color: string;
    id: string;
}[];

type ContentType = { title: string; mat: boolean; options: CustomizeOptionsProps[] };
function Page() {
    const { frameOptions } = useFrames();
    const [upload, setUpload] = useState<uploadOptionsProps>({
        dimensions: { width: 0, height: 0 },
        frame: "0.75 inch black frame",
        glazing: "Regular",
        printing:"Photo Paper",
        backing:"Pine Mdf Hardboard",
        stretching:"Regular",
        sides:"Image mirrored"
    });
    const [mat, setMat] = useState<matOptionsProps>([{width: 3, color: "white",id:new Date().toString()}]);

    if (frameOptions.framingStyle != "uploadAndFrame") return <></>;
    let customizeOptions = frameOptions.data.frameType; //TODO Must implement a context here
    let content: ContentType = {
        title: "Framed print with mat & glazing",
        mat: true,
        options: [
            {
                title: "Frame",
                items: ["0.75inch black frame"],
            },
            {
                title: "Glazing",
                items: ["Regular"],
            },
            {
                title: "Printing",
                items: ["Photo Paper", "Canvas"],
            },
            {
                title: "Backing",
                items: ["Pine Mdf Hardboard"],
            },
        ],
    };

    if (customizeOptions === "framedWithoutMG") {
        content = {
            title: "Framed print without mat and glazing",
            mat: false,
            options: [
                {
                    title: "Frame",
                    items: ["0.75inch black frame"],
                },
                {
                    title: "Printing",
                    items: ["Photo paper", "Canvas"],
                },
                {
                    title: "Streching",
                    items: ["Photo paper"],
                },
            ],
        };
    } else if (customizeOptions === "printOnly") {
        content = {
            title: "Print only",
            mat: false,
            options: [
                {
                    title: "Printing",
                    items: ["Photo paper", "Canvas"],
                },
            ],
        };
    } else if (customizeOptions === "canvasPrint") {
        content = {
            title: "Stretched canvas print",
            mat: false,
            options: [
                {
                    title: "Printing",
                    items: ["Photo paper", "Canvas"],
                },
                {
                    title: "Stretching",
                    items: ["regular-0.75 inch thick"],
                },
                {
                    title: "sides",
                    items: ["Image mirrored"],
                },
            ],
        };
    }

    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <FrameCanvas image={{ src: frameOptions.data.croppedImage as string, width: 12, height: 9 }}
                    matOptions={[{ color: "#eeeeee", width: 0.5 }, { color: "#777", width: 0.5 }]}
                    totalSize={{ width: 16, height: 12 }} frameBorder={{ borderWidth: 1, src: "" }} />
                <div className="mx-auto flex w-11/12 flex-col gap-6">
                    <h1 className="leading-auto text-3xl font-semibold">{content.title}</h1>
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
                                            disabled
                                        />
                                        <p>X</p>
                                        <Input
                                            type="number"
                                            min={1}
                                            step={1}
                                            className="w-20 border border-gray-2 p-3 px-2 text-center"
                                            placeholder="0"
                                            disabled
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
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        className="w-20 border border-gray-2 p-3 px-2 text-center"
                                                        placeholder="0"
                                                        value={mat[0].width}
                                                        onChange={(e) => {
                                                            // setMat({...mat[0], width: +e.target.value });
                                                        }}
                                                    />                                                    <span>
                                                        <strong>In</strong>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-x-2">
                                                    <p>Top:</p>
                                                    <Input
                                                        className="border border-gray-2 text-center"
                                                        placeholder="white"
                                                        value={mat[0].color}
                                                        onChange={(e) => {
                                                            // setMat({...mat[0], color: e.target.value });
                                                        }}
                                                    />                                                </div>
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
                                                //@ts-ignore
                                                <DropDown value={upload[option.title.toLowerCase()]} onChange={(status: string) => { setUpload((upload)=>{
                                                    return {...upload,[option.title.toLowerCase()]:status}
                                                }) }} items={option.items} />
                                            }
                                        />
                                    );
                                })}
                                {/* <InputField
                                    label={<strong>Printing</strong>}
                                    field={<span>No Printing</span>}
                                /> */}
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
        </>
    );
}

export default Page;
