"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import NextImage from "next/image";
import Upload from "../../assets/upload.svg";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/Checkbox";
import { useFormState, useFormStatus } from "react-dom";
import { addProduct } from "@/serverActions/admin/addProduct.action";

const FramseCategory = [
    "Frame + single mat",
    "Frame + double mats",
    "Picture frames",
    "Collages + single mat",
    "Collages + double mats",
    "Diplomas frames",
];
const FrameColors = [
    "Aqua",
    "Barnwood",
    "Black",
    "Blonde burl",
    "Brown",
    "Bronze",
    "Burgundy",
    "Charcoal",
    "Clear Stain",
    "Cherry",
    "Gold",
    "Coffee",
    "Green",
    "Grey",
    "12x12",
    "Honey",
];
const Collections = ["Natural Wood Collection", "Cloaseout pictures frames"];

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

    if (state?.success) {
        // Redirect to the product page
        formRef.current?.reset();
    }

    return (
        <section className="mx-auto flex max-w-screen-2xl justify-center">
            <div className="flex w-5/6 flex-col gap-y-8 py-6">
                <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
                <form action={action} ref={formRef} className="grid grid-cols-1 gap-10 md:grid-cols-5">
                    <div className="flex flex-col gap-y-7 md:col-span-2">
                        <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-xl font-semibold">Product Name</Label>
                                <Input className="h-14" name="productName" placeholder="Wooden frame" />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-xl font-semibold">Price</Label>
                                <Input
                                    className="relative h-14"
                                    name="productPrice"
                                    placeholder="$1,000,000"
                                    type="number"
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label className="text-xl font-semibold">Product Image</Label>
                                <Label className="cursor-pointer">
                                    <NextImage src={Upload} alt="upload" className="w-full" />
                                    <Input type="file" name="productImage" accept="image/*" className="hidden" />
                                </Label>
                            </div>
                        </div>
                        <div className="max-md:hidden">
                            <SubmitButton />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-3 md:col-span-3">
                        <h1 className="text-2xl font-semibold">Product Attributes</h1>
                        <div className="grid gap-5">
                            <div className="grid grid-cols-1 justify-between gap-y-5 md:grid-cols-2">
                                <div className="flex flex-col gap-y-1">
                                    <Label className="text-xl font-semibold">Frames Category</Label>
                                    <ul className="flex flex-col gap-3">
                                        {FramseCategory.map((item, index) => (
                                            <li key={index}>
                                                <Checkbox title={item} props={{ name: "frameCategories" }} onChange={undefined} checked={false} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="">
                                    <Label className="text-xl font-semibold">Frames Colors</Label>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {FrameColors.map((item, index) => (
                                            <li key={index}>
                                                <Checkbox title={item} props={{ name: "frameColors" }} onChange={undefined} checked={false} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-1 gap-y-5 md:grid-cols-2">
                                <div className="flex flex-col gap-y-1">
                                    <span className="text-xl font-semibold">Product size</span>
                                    <ul className="flex flex-col gap-y-5">
                                        <li className="flex items-center gap-x-11">
                                            <p>Width:</p>
                                            <div className="flex items-center gap-x-4">
                                                <Input
                                                    name="width"
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
                                                    name="height"
                                                    className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                                    placeholder="0"
                                                />
                                                <span className="align-center font-semibold">In</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-y-1">
                                    <span className="text-xl font-semibold">Collections</span>
                                    <ul className="flex flex-col gap-2">
                                        {Collections.map((item, index) => (
                                            <li key={index}>
                                                <Checkbox title={item} props={{ name: "collections" }} onChange={undefined} checked={false} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
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
