"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";
import { Glazing, Printing, Backing, Stretching, Sides } from "@prisma/client";
import { getFramesForCustomizatinAction, FramesForCustomizationType } from "@/serverActions/frames/frame.action";
import Image from "next/image";

type CustomizeOptionsProps =
    | {
          title: "Frame";
          items: FramesForCustomizationType[];
      }
    | {
          title: "Glazing" | "Printing" | "Backing" | "Stretching" | "Sides";
          items: string[];
      };

type uploadOptionsProps = {
    dimensions: { width: number; height: number };
    frame?: { id: string; borderWidth: number; borderSrc: string; name: string };
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
        printing: Object.keys(Printing)[0],
    });

    const [frames, setFrames] = useState<FramesForCustomizationType[]>([]);
    const [mat, setMat] = useState<matOptionsProps>([{ width: 0.75, color: "#ffffff", id: new Date().toString() }]);
    useEffect(() => {
        if (frameOptions.framingStyle === "uploadAndFrame") {
            switch (frameOptions.data.frameType) {
                case "printOnly":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: Object.keys(Printing)[0],
                    });
                    break;
                case "canvasPrint":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: Object.keys(Printing)[0],
                        backing: Object.keys(Backing)[0],
                        stretching: Object.keys(Stretching)[0],
                        sides: Object.keys(Sides)[0],
                    });
                    break;
                case "framedWithoutMG":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        frame: { id: "", borderWidth: 0, borderSrc: "", name: "" },
                        printing: Object.keys(Printing)[0],
                        stretching: Object.keys(Stretching)[0],
                    });
                    break;
                case "framedWithMG":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        frame: { id: "", borderWidth: 0, borderSrc: "", name: "" },
                        glazing: Object.keys(Glazing)[0],
                        printing: Object.keys(Printing)[0],
                        backing: Object.keys(Backing)[0],
                    });
                    break;
            }
        }
    }, [frameOptions, frames]);

    useEffect(() => {
        if (frameOptions.framingStyle == "uploadAndFrame") {
            let customizeOptions = frameOptions.data.frameType;
            if (customizeOptions == "framedWithoutMG" || customizeOptions == "framedWithMG") {
                getFramesForCustomizatinAction().then((data) => {
                    if (data.success) setFrames(data.data);
                });
            }
        }
    }, [frameOptions]);

    if (frameOptions.framingStyle != "uploadAndFrame") return <></>;

    let customizeOptions = frameOptions.data.frameType;
    let content: ContentType = {
        title: "Framed print with mat & glazing",
        mat: true,
        options: [
            {
                title: "Frame",
                items: frames,
            },
            {
                title: "Glazing",
                items: Object.keys(Glazing),
            },
            {
                title: "Printing",
                items: Object.keys(Printing),
            },
            {
                title: "Backing",
                items: Object.keys(Backing),
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
                    items: frames,
                },
                {
                    title: "Printing",
                    items: Object.keys(Printing),
                },
                {
                    title: "Stretching",
                    items: Object.keys(Stretching),
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
                    items: Object.keys(Printing),
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
                    items: Object.keys(Printing),
                },
                {
                    title: "Stretching",
                    items: Object.keys(Stretching),
                },
                {
                    title: "Sides",
                    items: Object.keys(Sides),
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
            width: frameOptions.data.width! + 2 * (upload.frame?.borderWidth || 0),
            height: frameOptions.data.height! + 2 * (upload.frame?.borderWidth || 0),
        },
    );
    console.log(frameOptions.data.width, frameOptions.data.height);
    console.log(totalSize);
    console.log(upload);

    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <FrameCanvas
                    image={{ src: frameOptions.data.croppedImage as string, ...upload.dimensions }}
                    matOptions={mat}
                    totalSize={totalSize}
                    frameBorder={{ borderWidth: upload.frame?.borderWidth || 0, src: upload.frame?.borderSrc || "" }}
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
                                        <div className="w-full">
                                            <div className="grid grid-cols-2 gap-6">
                                                <p>
                                                    Width(<b>Inch</b>):
                                                </p>
                                                <p>Color:</p>
                                            </div>
                                            {mat.map((m, ind) => {
                                                return (
                                                    <div
                                                        className="mb-3 grid w-full grid-cols-2 items-center gap-6"
                                                        key={ind}
                                                    >
                                                        <Input
                                                            type="number"
                                                            min={0.25}
                                                            step={0.25}
                                                            className="w-full border border-gray-2 p-2 text-center"
                                                            placeholder="0"
                                                            value={m.width}
                                                            onChange={(e) => {
                                                                setMat((_m) => {
                                                                    _m[ind].width = Number(e.target.value);
                                                                    return [..._m];
                                                                });
                                                            }}
                                                        />
                                                        <div className="flex items-center gap-x-2">
                                                            <Input
                                                                className="h-10 w-full p-1"
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
                                                                    className="flex-shrink-0 cursor-pointer"
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
                                                {" "}
                                                Add More Mat
                                            </button>
                                        </div>
                                    }
                                />
                            )}
                            <div className="flex flex-col gap-y-5">
                                {(customizeOptions === "framedWithMG" || customizeOptions == "framedWithoutMG") && (
                                    <>
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
                                                                        className="max-w-20 object-cover"
                                                                    />
                                                                    <div>
                                                                        <p>{frame.name}</p>
                                                                        <p>
                                                                            <small>
                                                                                Price per inch: {frame.unit_price}
                                                                            </small>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        };
                                                    })}
                                                    value={{
                                                        id: upload.frame?.id || "",
                                                        borderSrc: upload.frame?.borderSrc || "",
                                                        name: upload.frame?.name || "",
                                                    }}
                                                    onChange={(frameId: string) => {
                                                        const selectedFrame = frames.find(
                                                            (frame) => frame.id === frameId,
                                                        );
                                                        setUpload((upload) => {
                                                            return {
                                                                ...upload,
                                                                frame: {
                                                                    id: frameId,
                                                                    borderWidth: selectedFrame?.borderWidth || 0,
                                                                    borderSrc: selectedFrame?.borderSrc || "",
                                                                    name: selectedFrame?.name || "",
                                                                },
                                                            };
                                                        });
                                                    }}
                                                />
                                            }
                                        />
                                    </>
                                )}
                                {content.options.map((option, index) => {
                                    if (option.title === "Frame") {
                                        return <></>;
                                    }
                                    return (
                                        <InputField
                                            key={index}
                                            label={<strong>{option.title}</strong>}
                                            field={
                                                <DropDown
                                                    value={
                                                        upload[
                                                            option.title.toLowerCase() as keyof uploadOptionsProps
                                                        ] as string
                                                    }
                                                    onChange={(status: string) => {
                                                        setUpload((upload) => {
                                                            return {
                                                                ...upload,
                                                                [option.title.toLowerCase()]: status,
                                                            };
                                                        });
                                                    }}
                                                    items={option.items}
                                                />
                                            }
                                        />
                                    );
                                })}
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
