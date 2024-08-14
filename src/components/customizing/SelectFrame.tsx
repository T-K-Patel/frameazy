"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { BsArrowRight } from "react-icons/bs";
import { DialogContent, Dialog, DialogTrigger, DialogHeader } from "../ui/dialog";
import Image, { StaticImageData } from "next/image";
import Upload from "@/assets/uploadImage.svg";
import Empty from "@/assets/empty.svg";
import Mirror from "@/assets/mirror.svg";
import Canvas from "@/assets/canvas.svg";
import Paper from "@/assets/paper.svg";
import { useFrames } from "@/context/frames-context";
import { BiArrowBack, BiRepeat } from "react-icons/bi";
import { cn } from "@/lib/utils";
import UploadImage from "./UploadImage";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CropImage from "./CropImage";

type FrameOptionProps = {
    title: string;
    image: StaticImageData;
    props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
};

const FrameOption = ({ title, image, ...props }: FrameOptionProps) => {
    return (
        <button className="h-full gap-4 rounded-2xl border-2 border-[#d0d0d0] p-4 md:p-6" {...props}>
            <p className="w-full pb-3 text-left font-bold">{title}</p>
            <Image src={image} alt="canvas" />
        </button>
    );
};

type ContentType = { title: string; desc: string; options?: FrameOptionProps[]; component?: ReactNode };

const SelectFrame = () => {
    const { frameOptions: framing, setFrameOptions, resetFrames } = useFrames();
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const session = useSession();
    const contentDivRef = useRef<HTMLDivElement>(null);
    if (isOpen && session.status == "unauthenticated") {
        router.push("/auth/login");
        setIsOpen(false);
    }

    const framingString = JSON.stringify(framing);

    useEffect(() => {
        // on re-render, scroll content div to top
        contentDivRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [framingString]);

    let onBack = () => { };

    let content: ContentType = {
        title: "Select your style of frame",
        desc: "Welcome to frame selection, choose the style that best suits your taste and needs",
        options: [
            {
                title: "Upload and frame an image",
                image: Upload,
                props: {
                    onClick() {
                        setFrameOptions({ framingStyle: "uploadAndFrame", data: {} });
                    },
                },
            },
            {
                title: "Order Empty Frame",
                image: Empty,
                props: {
                    onClick() {
                        setFrameOptions({ framingStyle: "emptyFrame", data: {} });
                    },
                },
            },
            {
                title: "Design a mirror",
                image: Mirror,
                props: {
                    onClick() {
                        setFrameOptions({ framingStyle: "mirrorFrame", data: {} });
                        router.push("/customize/mirrorFrame");
                        setIsOpen(false);
                    },
                },
            },
        ],
    };

    if (framing.framingStyle == "emptyFrame") {
        content = {
            title: "Please select the type of frame you want to create",
            desc: "Choose the type of  empty frame your want to create",
            options: [
                {
                    title: "Empty frame for canvas or panel",
                    image: Canvas,
                    props: {
                        onClick() {
                            setFrameOptions({ framingStyle: "emptyFrame", data: { frameType: "canvas|panel" } });
                            router.push("/customize/emptyFrame");
                            setIsOpen(false);
                        },
                    },
                },
                {
                    title: "Empty frame for paper item",
                    image: Paper,
                    props: {
                        onClick() {
                            setFrameOptions({ framingStyle: "emptyFrame", data: { frameType: "paper" } });
                            router.push("/customize/emptyFrame");
                            setIsOpen(false);
                        },
                    },
                },
            ],
        };
        onBack = () => {
            setFrameOptions({ framingStyle: "none" });
        };
    } else if (framing.framingStyle == "uploadAndFrame") {
        if (!framing.data.image) {
            content = {
                title: "Image of the subject",
                desc: "Please select the image file to be uploaded",
                component: <UploadImage />,
            };
            onBack = () => {
                setFrameOptions({ framingStyle: "none" });
            };
        } else if (!framing.data.croppedImage) {
            content = {
                title: "Adjustment of image",
                desc: "What is the desired size of the printed image (inches)?",
                component: <CropImage />,
            };
            onBack = () => {
                setFrameOptions({ framingStyle: "uploadAndFrame", data: { ...framing.data, image: undefined } });
            };
        } else {
            content = {
                title: "Type of frame",
                desc: "Please select the type of product you want to create.",
                options: [
                    {
                        title: "Print only",
                        image: Upload,
                        props: {
                            onClick() {
                                setFrameOptions({
                                    framingStyle: "uploadAndFrame",
                                    data: { ...framing.data, frameType: "printOnly" },
                                });
                                router.push("/customize/uploadAndFrame");
                                setIsOpen(false);
                            },
                        },
                    },
                    {
                        title: "Stretched Canvas print",
                        image: Upload,
                        props: {
                            onClick() {
                                setFrameOptions({
                                    framingStyle: "uploadAndFrame",
                                    data: { ...framing.data, frameType: "canvasPrint" },
                                });
                                router.push("/customize/uploadAndFrame");
                                setIsOpen(false);
                            },
                        },
                    },
                    {
                        title: "Framed print without mat & glazing",
                        image: Upload,
                        props: {
                            onClick() {
                                setFrameOptions({
                                    framingStyle: "uploadAndFrame",
                                    data: { ...framing.data, frameType: "framedWithoutMG" },
                                });
                                router.push("/customize/uploadAndFrame");
                                setIsOpen(false);
                            },
                        },
                    },
                    {
                        title: "Framed print with mat & glazing",
                        image: Upload,
                        props: {
                            onClick() {
                                setFrameOptions({
                                    framingStyle: "uploadAndFrame",
                                    data: { ...framing.data, frameType: "framedWithMG" },
                                });
                                router.push("/customize/uploadAndFrame");
                                setIsOpen(false);
                            },
                        },
                    },
                ],
            };
            onBack = () => {
                setFrameOptions({ framingStyle: "uploadAndFrame", data: { ...framing.data, croppedImage: undefined } });
            };
        }
    }

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                <Button
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => setIsOpen(true)}
                    className="mt-8 h-min w-min bg-transparent px-8 py-4 text-xl font-semibold transition-all duration-200 active:scale-90"
                >
                    Start Framing&nbsp;
                    <BsArrowRight />
                </Button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    "flex max-h-[90%] min-h-[70%] w-5/6 max-w-screen-2xl flex-col px-5 max-md:w-11/12 md:max-h-[90%] md:px-10",
                    framing.framingStyle != "none" && framing.framingStyle != "mirrorFrame"
                        ? "pb-6 md:pb-14"
                        : "py-6 pt-10 md:py-14",
                )}
            >
                {framing.framingStyle != "none" && framing.framingStyle != "mirrorFrame" && (
                    <DialogHeader className="flex h-min flex-row gap-4 space-y-0 text-center">
                        <Button
                            size={"sm"}
                            variant={"outline"}
                            onClick={onBack}
                            className="h-min w-min border border-black p-2 text-sm font-semibold transition-all duration-200 active:scale-90 md:text-xl"
                        >
                            <BiArrowBack />
                            &nbsp;Back
                        </Button>
                        <Button
                            size={"sm"}
                            variant={"outline"}
                            onClick={resetFrames}
                            className="h-min w-min border border-black p-2 text-sm font-semibold transition-all duration-200 active:scale-90 md:text-xl"
                        >
                            <BiRepeat />
                            &nbsp;Reset
                        </Button>
                    </DialogHeader>
                )}
                <div
                    ref={contentDivRef}
                    className="flex h-auto w-auto flex-col items-center justify-start gap-y-5 overflow-y-auto md:gap-y-6"
                >
                    <div className="h-auto w-auto items-center gap-y-4">
                        <h1 className="leading-12 text-center text-xl font-semibold md:text-3xl">{content.title}</h1>
                        <p className="text-center text-sm md:text-xl md:leading-[30px]">{content.desc}</p>
                    </div>
                    <div
                        className={cn(
                            "grid items-center justify-center gap-3 gap-y-3 max-md:!grid-cols-1 max-md:flex-col md:gap-5",
                            framing.framingStyle == "uploadAndFrame" && framing.data.image && !framing.data.croppedImage
                                ? "w-full place-items-center"
                                : "",
                        )}
                        style={{
                            gridTemplateColumns: `repeat(${content.component ? 1 : content.options?.length == 4 ? 2 : content.options?.length || 3},1fr)`,
                        }}
                    >
                        {content.component ??
                            content.options?.map((option, index) => (
                                <FrameOption key={index} title={option.title} image={option.image} {...option.props} />
                            ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SelectFrame;
