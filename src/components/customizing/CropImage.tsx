import React, { useEffect } from "react";
import { useFrames } from "@/context/frames-context";
import NextImage from "next/image";

function CropImage() {
    const { frameOptions, setFrameOptions } = useFrames();
    useEffect(() => {
        if (frameOptions.framingStyle == "uploadAndFrame") {
            if (frameOptions.data?.image && frameOptions.data?.image instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result as string;
                    setFrameOptions({ ...frameOptions, data: { ...frameOptions.data, image: dataUrl } });
                };
                reader.readAsDataURL(frameOptions.data.image);
            }
        }
        // @ts-ignore
    }, [frameOptions, frameOptions.data?.image, setFrameOptions]);
    if (frameOptions.framingStyle != "uploadAndFrame") return null;
    function onCancel() {
        if (frameOptions.framingStyle == "uploadAndFrame") {
            setFrameOptions({ ...frameOptions, data: { ...frameOptions.data, image: undefined } });
        }
    }
    function onProceed() {
        if (frameOptions.framingStyle == "uploadAndFrame") {
            setFrameOptions({ ...frameOptions, data: { ...frameOptions.data, croppedImage: frameOptions.data.image } });
        }
    }
    if (!frameOptions.data.image) return null;

    return (
        // LATER: Add a cropping tool here
        <div className="flex flex-col items-center">
            <div>Input width and height</div>
            <div>
                <NextImage
                    src={frameOptions.data.image as string}
                    alt="image"
                    className="max-h-[32rem] max-w-[28rem]"
                    width={512}
                    height={746}
                />
            </div>
            <div className="mt-3 flex gap-3">
                <button onClick={onCancel} className="rounded-xl border border-red-500 p-3">
                    Cancel
                </button>
                <button onClick={onProceed} className="rounded-xl bg-green-500 p-3">
                    Proceed
                </button>
            </div>
        </div>
    );
}

export default CropImage;
