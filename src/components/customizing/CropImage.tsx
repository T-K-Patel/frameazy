"use client"
import React, { useCallback, useEffect, useState } from "react";
import { useFrames } from "@/context/frames-context";
import NextImage from "next/image";
import getCroppedImg from "@/serverActions/utils/cropImage";
import Cropper from "react-easy-crop"

function CropImage() {
    const { frameOptions, setFrameOptions } = useFrames();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
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
    // function onProceed() {
    //     if (frameOptions.framingStyle == "uploadAndFrame") {
    //         setFrameOptions({ ...frameOptions, data: { ...frameOptions.data, croppedImage: frameOptions.data.image } });
    //     }
    // }

    const onCropComplete = useCallback((croppedAreaPixels:any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onProceed = useCallback(async () => {
        if (frameOptions.framingStyle === "uploadAndFrame" && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(frameOptions.data.image, croppedAreaPixels);
                //@ts-ignore
                setFrameOptions({ ...frameOptions, data: { ...frameOptions.data, croppedImage } });
            } catch (e) {
                console.error(e);
            }
        }
    }, [croppedAreaPixels, frameOptions, setFrameOptions]);
    if (!frameOptions.data.image) return null;

    return (
        // LATER: Add a cropping tool here
        <div className="flex flex-col items-center">
            <div>Input width and height</div>
            <div>
                <Cropper
                    //@ts-ignore
                    image={frameOptions.data.image}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
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
