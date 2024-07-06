import AddArtwork from "@/components/AddArtwork";
import CustomizeDropDown from "@/components/CustomizeDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const MirrorOptions:string[]=["Regular"];
const FrameOptions:string[]=["0.75inch black frame"]

const Page=()=>{
    return (
        <section className="w-full flex justify-center">
            <div className="w-5/6 h-auto flex flex-col gap-5 lg:flex-row">
                <div className="w-[630px] h-[500px] bg-gray-2"/>
                <section className="flex flex-col gap-6">
                    <h1 className="font-semibold text-3xl leading-auto">Framed mirror</h1>
                    <div className="flex flex-col gap-y-20">
                        <ul className="flex flex-col gap-y-8">
                            <a className="w-full flex justify-between items-center">
                                <p className="font-semibold">Size</p>
                                <div className="flex gap-4 items-center">
                                    <Input className="w-[60px] h-[50px] border-gray-2 border-[1px] text-center" placeholder="0"/>
                                    <p>X</p>
                                    <Input className="w-[60px] h-[50px] border-gray-2 border-[1px] text-center" placeholder="0"/>
                                    <p className="font-semibold pr-2">In</p>
                                    <AddArtwork/>
                                </div>
                            </a>
                            <a className="w-full flex gap-x-20  justify-between items-center">
                                <p className="font-semibold">Mirror type</p>
                                <CustomizeDropDown items={MirrorOptions}/>
                            </a>
                            <a className="w-full flex gap-x-20  justify-between items-center">
                                <p className="font-semibold">Frame</p>
                                <CustomizeDropDown items={FrameOptions}/>
                            </a>
                            <a className="flex gap-x-20">
                                <p className="font-semibold">Total Size</p>
                                <div className="flex gap-x-2">
                                    <p>13</p>
                                    <p>X</p>
                                    <p>13</p>
                                    <p className="font-semibold">In</p>
                                </div>
                            </a>
                        </ul>
                        <div className="flex gap-x-14 w-full">
                            <div className="flex gap-x-10">
                                <p className="font-semibold">Price</p>
                                <h1 className="font-bold text-3xl w-[148px]">$ 2,00.00</h1>
                            </div>
                            <div className="max-w-[325px]">
                                <Button size={"lg"} className="max-w-[325px]">Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default Page;
