"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFrames } from "@/context/frames-context";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";
import { Glazing, Printing, Backing, Stretching, Sides, CustomizationType, CartCustomization } from "@prisma/client";
import { getFramesForCustomizatinAction, FramesForCustomizationType } from "@/serverActions/frames/frame.action";
import { addCartItemAction } from "@/serverActions/cart/addCartItem.action";
import { useRouter } from "next/navigation";
import AddToCartDialog from "../AddToCartDialog";
import { calculateTotalPrice } from "@/utils/totalPrice";
import { Skeleton } from "@/components/ui/skeleton";
import { Img } from "react-image";

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
    glazing?: Glazing;
    printing: Printing;
    backing?: Backing;
    stretching?: Stretching;
    sides?: Sides;
};

type matOptionsProps = {
    width: number;
    color: string;
    id: string;
}[];

type ContentType = { title: string; mat: boolean; options: CustomizeOptionsProps[] };
function Page() {
    const { frameOptions, customizingFrame, setCustomizingFrame } = useFrames();
    const [upload, setUpload] = useState<uploadOptionsProps>({
        dimensions: { width: 0, height: 0 },
        printing: Object.keys(Printing)[0] as Printing,
    });

    const [frames, setFrames] = useState<FramesForCustomizationType[]>([]);
    const [mat, setMat] = useState<matOptionsProps>([{ width: 0.75, color: "#ffffff", id: new Date().toString() }]);

    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (frameOptions.framingStyle === "uploadAndFrame") {
            switch (frameOptions.data.frameType) {
                case "printOnly":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: Object.keys(Printing)[0] as Printing,
                    });
                    break;
                case "canvasPrint":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: Object.keys(Printing)[0] as Printing,
                        backing: Object.keys(Backing)[0] as Backing,
                        stretching: Object.keys(Stretching)[0] as Stretching,
                        sides: Object.keys(Sides)[0] as Sides,
                    });
                    break;
                case "framedWithoutMG":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        printing: Object.keys(Printing)[0] as Printing,
                        stretching: Object.keys(Stretching)[0] as Stretching,
                    });
                    break;
                case "framedWithMG":
                    setUpload({
                        dimensions: { width: frameOptions.data.width!, height: frameOptions.data.height! },
                        glazing: Object.keys(Glazing)[0] as Glazing,
                        printing: Object.keys(Printing)[0] as Printing,
                        backing: Object.keys(Backing)[0] as Backing,
                    });
                    break;
            }
        }
        setError(null);
    }, [frameOptions, frames]);

    useEffect(() => {
        if (frameOptions.framingStyle == "uploadAndFrame") {
            let customizeOptions = frameOptions.data.frameType;
            if (customizeOptions == "framedWithoutMG" || customizeOptions == "framedWithMG") {
                getFramesForCustomizatinAction()
                    .then((data) => {
                        if (data.success) setFrames(data.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        setLoading(false);
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
            width: frameOptions.data.width! + 2 * (customizingFrame?.borderWidth || 0),
            height: frameOptions.data.height! + 2 * (customizingFrame?.borderWidth || 0),
        },
    );
    let custType: CustomizationType = "ImageCanvasPrint";
    switch (frameOptions.data.frameType) {
        case "printOnly":
            custType = "ImagePrintOnly";
            break;
        case "canvasPrint":
            custType = "ImageCanvasPrint";
            break;
        case "framedWithoutMG":
            custType = "ImageWithoutMatAndGlazing";
            break;
        case "framedWithMG":
            custType = "ImageWithMatAndGlazing";
            break;
    }

    const data: Omit<CartCustomization, "id"> = {
        type: custType,
        width: totalSize.width,
        height: totalSize.height,
        image: frameOptions.data.croppedImage as string,
        mirror: null,
        glazing: upload.glazing || null,
        printing: upload.printing || null,
        backing: upload.backing || null,
        stretching: upload.stretching || null,
        sides: upload.sides || null,
        mat: mat.map((m) => ({ color: m.color, width: m.width })),
    };

    const price =
        calculateTotalPrice(data, {
            unit_price: customizingFrame?.unit_price || 0,
            borderWidth: customizingFrame?.borderWidth || 0,
        }) / 100;

    const addToCart = (qty: number) => {
        if (!data.glazing && customizeOptions === "framedWithMG") {
            setError("Please select a glazing option");
            return;
        }
        if (!data.printing) {
            setError("Please select a printing option");
            return;
        }
        if (!data.backing && customizeOptions === "framedWithMG") {
            setError("Please select a backing option");
            return;
        }
        if (!data.stretching && (customizeOptions === "canvasPrint" || customizeOptions === "framedWithoutMG")) {
            setError("Please select a stretching option");
            return;
        }
        if (!data.sides && customizeOptions === "canvasPrint") {
            setError("Please select a sides option");
            return;
        }

        if (customizingFrame && frameOptions.data.frameType?.startsWith("framed") && !customizingFrame.id) {
            setError("Please select a frame");
            return;
        }

        setAddingToCart(true);
        addCartItemAction(data, {
            frameId: customizingFrame && frameOptions.data.frameType?.startsWith("framed") ? customizingFrame.id : "",
            qty,
            externalImage: frameOptions.data.usingExternalImage,
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
            })
            .finally(() => {
                setAddingToCart(false);
            });
    };

    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <FrameCanvas
                    image={{ src: frameOptions.data.croppedImage as string, ...upload.dimensions }}
                    matOptions={mat}
                    totalSize={totalSize}
                    frameBorder={
                        customizingFrame && frameOptions.data.frameType?.startsWith("framed")
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
                                                loading ? (
                                                    <Skeleton className="h-8 rounded-xl md:h-24" />
                                                ) : (
                                                    <FrameDropdown
                                                        items={frames.map((frame) => {
                                                            return {
                                                                value: frame.id,
                                                                label: (
                                                                    <div className="flex gap-3" key={frame.name}>
                                                                        <Img
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
                                                                                    Price per inch:{" "}
                                                                                    {(frame.unit_price / 100).toFixed(
                                                                                        2,
                                                                                    )}{" "}
                                                                                    <strong>&#8377;</strong>
                                                                                </small>
                                                                            </p>
                                                                            <p>
                                                                                <small>
                                                                                    Border Thickness:{" "}
                                                                                    {frame.borderWidth}{" "}
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
                                                            const selectedFrame = frames.find(
                                                                (frame) => frame.id === frameId,
                                                            );
                                                            setCustomizingFrame(() => ({
                                                                id: frameId,
                                                                borderWidth: selectedFrame?.borderWidth || 0,
                                                                borderSrc: selectedFrame?.borderSrc || "",
                                                                name: selectedFrame?.name || "",
                                                                unit_price: selectedFrame?.unit_price || 0,
                                                            }));
                                                        }}
                                                    />
                                                )
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
                                <span className="text-2xl font-bold max-md:col-span-2">₹ {price.toFixed(2)}</span>
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
}

export default Page;
