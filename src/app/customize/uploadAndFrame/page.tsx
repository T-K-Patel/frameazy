"use client";
import DropDown from "@/components/DropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";

type CustomizeOptionsProps = {
    title: string;
    items: string[];
};

type uploadOptionsProps = {
    dimensions: { width: number; height: number };
    frame?: { src: string; borderWidth: number };
    glazing?: string;
    printing: string;
    backing?: string;
    stretching?: string;
    sides?: string;
};

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
        printing: "Photo Paper",
    });
    const [mat, setMat] = useState<matOptionsProps>([{ width: 0.75, color: "#ffffff", id: new Date().toString() }]);
    useEffect(() => {
        if (frameOptions.framingStyle === "uploadAndFrame") {
            switch (frameOptions.data.frameType) {
                case "printOnly":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: "Photo Paper",
                    });
                    break;
                case "canvasPrint":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: "Canvas",
                        backing: "Pine Mdf Hardboard",
                        stretching: "Regular",
                        sides: "Image mirrored",
                    });
                    break;
                case "framedWithoutMG":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        frame: { src: "0.75inch black frame", borderWidth: 1 },
                        printing: "Photo Paper",
                        stretching: "Photo Paper",
                    });
                    break;
                case "framedWithMG":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        frame: { src: "0.75inch black frame", borderWidth: 1 },
                        glazing: "Regular",
                        printing: "Photo Paper",
                        backing: "Pine Mdf Hardboard",
                    });
                    break;
            }
        }
    }, [frameOptions]);

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

    if (!content.mat && mat.length > 0) {
        setMat([]);
    }

    const totalSize = mat.reduce(
        (acc, m) => {
            acc.width += m.width * 2;
            acc.height += m.width * 2;
            return { ...acc };
        },
        {
            width: frameOptions.data.width! + 2 * upload.frame?.borderWidth!,
            height: frameOptions.data.height! + 2 * upload.frame?.borderWidth!,
        },
    );

    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <FrameCanvas
                    image={{ src: frameOptions.data.croppedImage as string, ...upload.dimensions }}
                    matOptions={mat}
                    totalSize={totalSize}
                    frameBorder={upload.frame}
                />
                <div className="mx-auto flex w-11/12 flex-col gap-6">
                    <h1 className="leading-auto text-3xl font-semibold">{content.title}</h1>
                    <div className="mb-3 flex flex-col gap-y-5">
                        <div className="flex flex-col gap-y-8">
                            <InputField
                                label={<strong>Size</strong>}
                                field={
                                    <p>
                                        <span>{frameOptions.data.width}</span> <span>X</span>{" "}
                                        <span>{frameOptions.data.height}</span>{" "}
                                        <span className="font-semibold">In</span>
                                    </p>
                                }
                            />
                            {content.mat && (
                                <InputField
                                    label={<strong>Mat</strong>}
                                    field={
                                        <div>
                                            {mat.map((m, ind) => {
                                                return (
                                                    <div
                                                        className="mb-3 grid w-full items-center gap-4 md:grid-cols-2"
                                                        key={ind}
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <p className="">Width:</p>
                                                            <Input
                                                                type="number"
                                                                min={0.25}
                                                                step={0.25}
                                                                className="w-20 border border-gray-2 p-3 px-2 text-center"
                                                                placeholder="0"
                                                                value={m.width}
                                                                onChange={(e) => {
                                                                    setMat((_m) => {
                                                                        _m[ind].width = Number(e.target.value);
                                                                        return [..._m];
                                                                    });
                                                                }}
                                                            />
                                                            <span>
                                                                <strong>In</strong>
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-x-2">
                                                            <p>Color:</p>
                                                            <Input
                                                                className="h-10 w-20 p-1"
                                                                placeholder="white"
                                                                value={m.color}
                                                                type="color"
                                                                onChange={(e) => {
                                                                    setMat((_m) => {
                                                                        _m[ind].color = e.target.value;
                                                                        return [..._m];
                                                                    });
                                                                }}
                                                            />
                                                            {ind != 0 && (
                                                                <IoCloseSharp
                                                                    className="flex-shrink-0"
                                                                    onClick={() => {
                                                                        setMat((_m) => {
                                                                            return _m.filter((rm) => {
                                                                                return rm.id != m.id;
                                                                            });
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <button
                                                onClick={() => {
                                                    setMat((m) => {
                                                        return [
                                                            ...m,
                                                            {
                                                                width: 0.75,
                                                                color: "#ffffff",
                                                                id: new Date().toString(),
                                                            },
                                                        ];
                                                    });
                                                }}
                                                className="text-blue-1"
                                            >
                                                Add More Mat
                                            </button>
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
                                                <DropDown
                                                    value={
                                                        option.title != "Frame"
                                                            ? (upload[
                                                                  option.title.toLowerCase() as keyof uploadOptionsProps
                                                              ] as string)
                                                            : upload.frame?.src!
                                                    }
                                                    onChange={(status: string) => {
                                                        setUpload((upload) => {
                                                            if (option.title != "Frame") {
                                                                return {
                                                                    ...upload,
                                                                    [option.title.toLowerCase()]: status,
                                                                };
                                                            }
                                                            return {
                                                                ...upload,
                                                                [option.title.toLowerCase()]: {
                                                                    src: status,
                                                                    borderWidth: 1,
                                                                },
                                                            };
                                                        });
                                                    }}
                                                    items={option.items}
                                                />
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
                                        <span>{totalSize.width}</span> <span>X</span> <span>{totalSize.height}</span>{" "}
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
