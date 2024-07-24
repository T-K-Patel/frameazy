import AddArtwork from "@/components/AddArtwork";
import CustomizeDropDown from "../CustomizeDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import InputField from "../InputField";

const MirrorOptions: string[] = ["Regular"];
const frames: string[] = ["0.75inch black frame"];

const Page = () => {
    return (
        <>
            <div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
                <div className="bg-gray-2" />
                <div className="mx-auto flex w-11/12 flex-col gap-6">
                    <h1 className="leading-auto text-3xl font-semibold">Framed mirror</h1>
                    <div className="mb-3 flex flex-col gap-y-5">
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
                                        />
                                        <p>X</p>
                                        <Input
                                            type="number"
                                            min={1}
                                            step={1}
                                            className="w-20 border border-gray-2 p-3 px-2 text-center"
                                            placeholder="0"
                                        />
                                        <span className="pr-2 font-semibold">In</span>
                                    </div>
                                }
                            />
                            <InputField
                                label={<strong>Mirror type</strong>}
                                field={<CustomizeDropDown items={MirrorOptions} />}
                            />
                            <InputField label={<strong>Frame</strong>} field={<CustomizeDropDown items={frames} />} />
                            <InputField
                                label={<strong>Total Size</strong>}
                                field={
                                    <p>
                                        <span>13</span> <span>X</span> <span>13</span>{" "}
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
};

export default Page;
