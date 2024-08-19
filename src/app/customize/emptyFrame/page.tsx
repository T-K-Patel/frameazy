"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import { BiX } from "react-icons/bi";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";
import useDebounce from "@/lib/useDebounce";
import { Customization, CustomizationType, Glazing } from "@prisma/client";
import Image from "next/image";
import { FramesForCustomizationType, getFramesForCustomizatinAction } from "@/serverActions/frames/frame.action";
import { addCartItemAction } from "@/serverActions/cart/addCartItem.action";
import AddToCartDialog from "../AddToCartDialog";
import { useRouter } from "next/navigation";

type CustomizeOptionsProps = {
    title: string;
    items: string[];
};

type emptyFrameProps = {
    dimensions: { width: number; height: number };
    glazing?: Glazing;
};

type matOptionsProps = {
    width: number;
    color: string;
    id: string;
}[];
type ContentType = { title: string; warning: string; mat: boolean; options: CustomizeOptionsProps[] };

function Page() {
    const { frameOptions, customizingFrame, setCustomizingFrame } = useFrames();
    const [upload, setUpload] = useState<emptyFrameProps>({
        dimensions: { width: 12, height: 9 },
        glazing: Object.keys(Glazing)[0] as Glazing,
    });
    const [frames, setFrames] = useState<FramesForCustomizationType[]>([]);
    const [mat, setMat] = useState<matOptionsProps>([{ width: 0.5, color: "#ffffff", id: new Date().toString() }]);
    const debouncedFrame = useDebounce<emptyFrameProps>(upload, 300);
    const debouncedMat = useDebounce<matOptionsProps>(mat, 1000);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (frameOptions.framingStyle === "emptyFrame") {
            switch (frameOptions.data.frameType) {
                case "canvas|panel":
                    setUpload({
                        dimensions: { width: 12, height: 9 },
                    });
                    break;
                case "paper":
                    setUpload({
                        dimensions: { width: 12, height: 9 },
                        glazing: Object.keys(Glazing)[0] as Glazing,
                    });
                    break;
            }
        }
        setError(null);
    }, [frameOptions, frames]);

    useEffect(() => {
        if (frameOptions.framingStyle === "emptyFrame") {
            getFramesForCustomizatinAction()
                .then((res) => {
                    if (res.success) {
                        setFrames(res.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
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
                items: Object.keys(Glazing),
            },
        ],
    };

    if (customizeOptions === "canvas|panel") {
        content = {
            title: "Empty frame for canvas or panel",
            warning: "Important! As shown, the frame will be cut to leave 3/8” between your subject and the floater.",
            mat: false,
            options: [],
        };
    }

    if (!content.mat && mat.length > 0) {
        setMat([]);
    }

    const totalSize = debouncedMat.reduce(
        (acc, m) => {
            acc.width += m.width * 2;
            acc.height += m.width * 2;
            return { ...acc };
        },
        {
            width: debouncedFrame.dimensions.width + 2 * (customizingFrame?.borderWidth || 0),
            height: debouncedFrame.dimensions.height + 2 * (customizingFrame?.borderWidth || 0),
        },
    );

    const addToCart = (qty: number) => {
        let custType: CustomizationType = "EmptyForCanvas";
        switch (frameOptions.data.frameType) {
            case "canvas|panel":
                custType = "EmptyForCanvas";
                break;
            case "paper":
                custType = "EmptyForPaper";
                break;
        }
        const data: Omit<Customization, "id"> = {
            type: custType,
            width: totalSize.width,
            height: totalSize.height,
            mirror: null,
            printing: null,
            stretching: null,
            backing: null,
            sides: null,
            image: null,
            glazing: upload.glazing || null,
            mat: mat.map((m) => ({ color: m.color, width: m.width })),
        };

        if (!data.glazing && customizeOptions === "paper") {
            setError("Please select a glazing option");
            return;
        }

        if (customizingFrame && !customizingFrame.id) {
            setError("Please select a frame");
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
        <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
            <FrameCanvas
                matOptions={debouncedMat}
                totalSize={totalSize}
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
                <h1 className="leading-auto text-3xl font-semibold">{content.title}</h1>
                <div className="mb-3 flex flex-col gap-y-5">
                    <div className="flex gap-3 rounded-lg bg-yellow-300 p-3 px-5">
                        <BiX className="flex-shrink-0" />
                        <p className="text-justify">{content.warning}</p>
                    </div>
                    <div className="flex flex-col gap-y-8">
                        <InputField
                            label={<strong>Opening Size</strong>}
                            field={
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        min={1}
                                        step={1}
                                        className="w-20 border border-gray-2 p-3 px-2 text-center"
                                        placeholder="0"
                                        value={upload.dimensions.width}
                                        onChange={(e) => {
                                            setUpload({
                                                ...upload,
                                                dimensions: { ...upload.dimensions, width: Number(e.target.value) },
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
                                        value={upload.dimensions.height}
                                        onChange={(e) => {
                                            setUpload({
                                                ...upload,
                                                dimensions: { ...upload.dimensions, height: Number(e.target.value) },
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
                                                        <IoCloseSharp
                                                            className="flex-shrink-0 cursor-pointer"
                                                            style={{ visibility: ind == 0 ? "hidden" : "visible" }}
                                                            onClick={() => {
                                                                if (ind != 0) {
                                                                    setMat((_m) => _m.filter((rm) => rm.id != m.id));
                                                                }
                                                            }}
                                                        />
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
                                                            width: 0.25,
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
                            {content.title === "Empty frame for paper items" && (
                                <>
                                    <InputField
                                        label={<strong>Glazing</strong>}
                                        field={
                                            <DropDown
                                                value={upload.glazing || ""}
                                                onChange={(status: Glazing) => {
                                                    setUpload({ ...upload, glazing: status });
                                                }}
                                                items={content.options[0].items}
                                            />
                                        }
                                    />
                                </>
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
    );
}

export default Page;
