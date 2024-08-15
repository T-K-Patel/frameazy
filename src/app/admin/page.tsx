"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, DragEventHandler, forwardRef, useEffect, useState } from "react";
import NextImage from "next/image";
import Upload from "../../assets/upload.svg";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { addProduct } from "@/serverActions/admin/admin.action";
import DropDown from "@/components/DropDown";
import { Collection, Color, Category } from "@prisma/client";

type UploadImageProps = {
    name: string;
};
const UploadImage = forwardRef<HTMLInputElement, { name: string }>(function UploadImage(
    { name }: UploadImageProps,
    ref,
) {
    const [error, setError] = useState(null as string | null);
    const [file, setFile] = useState<File | null>(null);
    const [dataUrl, setDataUrl] = useState<{ src: string; width: number; height: number } | null>(null);

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        const newFile = e.dataTransfer.files[0];
        if (!newFile.type.startsWith("image/")) {
            setError("Only Images are allowed");
            return;
        }
        setFile(newFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const image = new Image();
            image.src = dataUrl;
            image.onload = () => {
                setDataUrl({ src: dataUrl, width: image.width, height: image.height });
            };
        };
        reader.readAsDataURL(newFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.length ? e.target.files[0] : null;
        if (newFile) {
            setFile(newFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                const image = new Image();
                image.src = dataUrl;
                image.onload = () => {
                    setDataUrl({ src: dataUrl, width: image.width, height: image.height });
                };
            };
            reader.readAsDataURL(newFile);
        } else {
            if (!file) setError("Invalid file");
        }
    };
    return (
        <div onDragOver={handleDragOver} onDrop={handleDrop}>
            <>
                <Label className="relative cursor-pointer">
                    <NextImage
                        src={dataUrl ?? Upload}
                        width={dataUrl ? dataUrl.width : Upload.width}
                        height={dataUrl ? dataUrl.height : Upload.height}
                        alt="Auth Image"
                        className="mx-auto max-h-[20rem] w-full max-w-[28rem] object-contain"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        name={name}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {file && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-center text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
                            Click to Upload new Image
                        </div>
                    )}
                </Label>
                {error && <p className="mt-3 text-center text-red-500">{error}</p>}
            </>
        </div>
    );
});
const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} className="h-auto w-full py-3 text-lg" disabled={pending}>
            {pending ? "Uploading" : "Upload"}
        </Button>
    );
};

const AdminDashboard = () => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [state, action] = useFormState(addProduct, null);

    const prodImgref = React.useRef<HTMLInputElement>(null);
    const borderImgref = React.useRef<HTMLInputElement>(null);

    const [dropdownData, setDropdownData] = useState<{ color: string; category: string; collection: string }>({
        color: "",
        category: "",
        collection: "",
    });

    useEffect(() => {
        if (state?.success) {
            // Redirect to the product page
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <section className="mx-auto flex max-w-screen-2xl justify-center">
            <div className="flex w-5/6 flex-col gap-y-8 py-6">
                <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
                {state?.success == false && <p className="mt-3 text-red-500">{state.error}</p>}
                <form action={action} ref={formRef} className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="flex flex-col gap-y-7">
                        <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-lg font-semibold">Product Name</Label>
                                <Input className="h-12" name="productName" placeholder="Wooden frame" />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-lg font-semibold">Unit Price(₹)</Label>
                                <Input
                                    className="relative h-12"
                                    name="unitPrice"
                                    placeholder="$1,000,000"
                                    type="number"
                                />
                            </div>
                            <div className="grid grid-cols-1 justify-between gap-5">
                                <div className="flex flex-col gap-y-1">
                                    <Label className="text-lg font-semibold">Frames Category</Label>
                                    <input type="hidden" name="productCategory" value={dropdownData.category} />
                                    <DropDown
                                        items={Object.keys(Category)}
                                        value={dropdownData.category}
                                        onChange={(val: string) => {
                                            setDropdownData((d) => ({ ...d, category: val }));
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-1">
                                    <Label className="text-lg font-semibold">Frames Colors</Label>
                                    <input type="hidden" name="productColor" value={dropdownData.color} />
                                    <DropDown
                                        items={Object.keys(Color)}
                                        value={dropdownData.color}
                                        onChange={(val: string) => {
                                            setDropdownData((d) => ({ ...d, color: val }));
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-1">
                                    <span className="text-lg font-semibold">Collections</span>
                                    <input type="hidden" name="productCollection" value={dropdownData.collection} />
                                    <DropDown
                                        items={Object.keys(Collection)}
                                        value={dropdownData.collection}
                                        onChange={(val: string) => {
                                            setDropdownData((d) => ({ ...d, collection: val }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="mt-5">
                                    <div className="flex flex-col gap-y-1">
                                        <span className="text-xl font-semibold">Border Thickness</span>
                                        <ul className="flex flex-col gap-y-5">
                                            <li className="flex items-center gap-x-11">
                                                <p>Thickenss:</p>
                                                <div className="flex items-center gap-x-4">
                                                    <Input
                                                        name="borderWidth"
                                                        className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                                        placeholder="0"
                                                    />
                                                    <span className="font-semibold">In</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="flex flex-col gap-y-1">
                                        <span className="text-xl font-semibold">Standard size(optional)</span>
                                        <ul className="flex flex-col gap-y-5">
                                            <li className="flex items-center gap-x-11">
                                                <p>Width:</p>
                                                <div className="flex items-center gap-x-4">
                                                    <Input
                                                        name="productWidth"
                                                        className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                                        placeholder="0"
                                                    />
                                                    <span className="font-semibold">In</span>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-x-10">
                                                <p>Height:</p>
                                                <div className="flex items-center gap-x-4">
                                                    <Input
                                                        name="productHeight"
                                                        className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                                        placeholder="0"
                                                    />
                                                    <span className="align-center font-semibold">In</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-md:hidden">
                            <SubmitButton />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <h1 className="text-2xl font-semibold">Product Attributes</h1>
                        <div className="grid gap-5">
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-xl font-semibold">Product Image</Label>
                                <UploadImage ref={prodImgref} name="productImage" />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-xl font-semibold">Border Image</Label>
                                <Label className="text-sm font-semibold">(Use image of top border.)</Label>
                                <UploadImage ref={borderImgref} name="borderImage" />
                            </div>
                        </div>
                        <div className="md:hidden">
                            <SubmitButton />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminDashboard;
