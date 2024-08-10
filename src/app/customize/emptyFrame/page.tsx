"use client";
import DropDown from "@/components/DropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import { BiX } from "react-icons/bi";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";

type CustomizeOptionsProps = {
    title: string;
    items: string[];
};

type emptyFrameProps = {
    dimensions: { width: number; height: number };
    frame?: { src: string; borderWidth: number };
    glazing?: string;
};

type matOptionsProps = {
    width: number;
    color: string;
    id: string;
}[];
type ContentType = { title: string; warning: string; mat: boolean; options: CustomizeOptionsProps[] };

function Page() {
    const { frameOptions } = useFrames();
    const [frame, setFrame] = useState<emptyFrameProps>({
        dimensions: { width: 0, height: 0 },
        frame: { src: "0.75 inch black frame", borderWidth: 1 },
        glazing: "Regular",
    });
    const [mat, setMat] = useState<matOptionsProps>([{ width: 3, color: "white", id: new Date().toString() }]);

    useEffect(() => {
        if (frameOptions.framingStyle === "emptyFrame") {
            switch (frameOptions.data.frameType) {
                case "canvas|panel":
                    setFrame({
                        dimensions: { width: 12, height: 9 },
                        frame: { src: "0.75 inch black frame", borderWidth: 1 },
                    });
                    break;
                case "paper":
                    setFrame({
                        dimensions: { width: 12, height: 9 },
                        frame: { src: "0.75 inch black frame", borderWidth: 1 },
                        glazing: "Regular",
                    });
                    break;
            }
        }
    }, [frameOptions]);

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
            width: frame.dimensions.width + 2 * frame.frame?.borderWidth!,
            height: frame.dimensions.height + 2 * frame.frame?.borderWidth!,
        },
    );

    return (
        <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
            <FrameCanvas matOptions={mat} totalSize={totalSize} frameBorder={frame.frame} />
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
                                        value={frame.dimensions.width}
                                        onChange={(e) => {
                                            setFrame({
                                                ...frame,
                                                dimensions: { ...frame.dimensions, width: Number(e.target.value) },
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
                                        value={frame.dimensions.height}
                                        onChange={(e) => {
                                            setFrame({
                                                ...frame,
                                                dimensions: { ...frame.dimensions, height: Number(e.target.value) },
                                            });
                                        }}
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
                                                            min={1}
                                                            step={1}
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
                                                        { width: 0.75, color: "#ffffff", id: new Date().toString() },
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
                            {content.title === "Empty frame for paper items" ? (
                                <>
                                    <InputField
                                        label={<strong>Glazing</strong>}
                                        field={
                                            <DropDown
                                                value={frame.glazing || ""}
                                                onChange={(status: string) => {
                                                    setFrame({ ...frame, glazing: status });
                                                }}
                                                items={content.options[0].items}
                                            />
                                        }
                                    />
                                    <InputField
                                        label={<strong>Frame</strong>}
                                        field={
                                            <DropDown
                                                value={frame.frame?.src!}
                                                onChange={(status: string) => {
                                                    setFrame({ ...frame, frame: { src: status, borderWidth: 0.75 } });
                                                }}
                                                items={content.options[1].items}
                                            />
                                        }
                                    />
                                </>
                            ) : (
                                <InputField
                                    label={<strong>Frame</strong>}
                                    field={
                                        <DropDown
                                            value={frame.frame?.src!}
                                            onChange={(status: string) => {
                                                setFrame({ ...frame, frame: { src: status, borderWidth: 0.75 } });
                                            }}
                                            items={content.options[1].items}
                                        />
                                    }
                                />
                            )}
                            <InputField label={<strong>Printing</strong>} field={<span>No Printing</span>} />
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
    );
}

export default Page;
