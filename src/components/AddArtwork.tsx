import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Upload from "../assets/upload.svg";
import Image from "next/image";

const AddArtwork = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <p className="md: border-[1px] border-blue-1 bg-white py-3 text-black hover:bg-blue-1/20">
                    Add Artwork
                </p>
            </DialogTrigger>
            <DialogContent className="flex h-[494px] w-[335px] flex-col items-center gap-y-[32px] md:h-[750px] md:w-[676px] md:p-[48px]">
                <div className="absolute left-[23.79px] top-[51.54px] flex h-[335.36px] w-[287.43px] flex-col gap-y-[19.82px] md:fixed md:h-auto md:w-[580px] md:gap-y-[40px]">
                    <div className="flex h-[91.96px] w-full flex-col gap-y-[3.96px] md:h-auto md:gap-y-[8px]">
                        <div className="h-[24px] w-auto font-semibold leading-[24px] md:h-[48px] md:text-3xl/[32px] md:leading-[48px]">
                            Add Artwork
                        </div>
                        <div className="h-[64px] w-full text-xs/[10px] leading-[16px] md:h-auto md:leading-[25.6px]">
                            We offer you the flexibility to add artwork in a way that suits your preferences. Whether
                            you have a direct link to the piece you want to frame or wish to browse through our system.
                        </div>
                    </div>
                    <div className="flex h-[233.57px] w-full flex-col gap-y-[16px] md:h-[423px] md:gap-y-[32px]">
                        <div className="flex h-[61.96px] w-full flex-col gap-y-[8px] md:h-[98px] md:gap-y-[16px]">
                            <div className="h-[18px] w-auto text-xs font-semibold leading-[18px] md:h-[30px] md:text-xl md:leading-[30px]">
                                Link to Artwork
                            </div>
                            <Input
                                className="h-[40px] w-full rounded-[6px] border-[0.5px] border-gray-2 md:h-[60px] md:w-[580px] md:rounded-[12px] md:border-[1px]"
                                placeholder="https://www.shutterstock.com/image-illustration"
                            />
                        </div>
                        <div className="flex h-[15px] w-full justify-center gap-x-[8px] md:h-[30px]">
                            <div className="h-full w-auto text-xs/[9.91px] font-semibold leading-[15px] md:text-xl md:leading-[30px]">
                                or
                            </div>
                        </div>
                        <div className="flex h-[114.61px] w-full flex-col gap-y-[8px] md:h-[231px] md:gap-y-[16px]">
                            <div className="h-[15px] w-auto align-middle text-xs/[10px] font-semibold leading-[15px] md:h-[30px] md:text-xl md:leading-[30px]">
                                Add Artwork
                            </div>
                            <Image src={Upload} alt="upload" className="h-[91.68px] w-full md:h-[185px]" />
                        </div>
                    </div>
                    <Button
                        size="md"
                        className="h-[40px] w-full rounded-[12px] border-[1px] text-xl font-semibold leading-[30px] md:h-[60px]"
                    >
                        Add
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddArtwork;
