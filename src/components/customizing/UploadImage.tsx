import NextImage from "next/image";
import React, { ChangeEvent, DragEvent, useState } from "react";
import UploadIcon from "@/assets/upload.svg";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFrames } from "../frames-context";

function UploadImage() {
    const [error, setError] = useState(null as string | null);
    const { setFrameOptions } = useFrames();

    const setImage = (image: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageBlob = new Blob([reader.result as ArrayBuffer], { type: image.type });
            const img = new Image();
            img.onload = () => {
                setFrameOptions({ framingStyle: "uploadAndFrame", data: { image } });
            };
            img.onerror = () => {
                // Image is invalid
                setError("Image file is required");
                console.error("Invalid image");
            };
            img.src = URL.createObjectURL(imageBlob);
        };
        reader.readAsArrayBuffer(image);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const newFile = e.dataTransfer.files[0];
        setImage(newFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.length ? e.target.files[0] : null;
        newFile && setImage(newFile);
    };
    return (
        <div onDragOver={handleDragOver} onDrop={handleDrop}>
            <Label className="cursor-pointer">
                <NextImage src={UploadIcon} alt="Auth Image" className="w-[28rem]" />
                <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </Label>
            {error && <p className="mt-3 text-center text-red-500">{error}</p>}
        </div>
    );
}

export default UploadImage;
