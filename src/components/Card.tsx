import Image, { StaticImageData } from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Cart from "../assets/cart.svg";
import Edit from "../assets/edit-2.svg";

const Card = ({ image, title, price }: { image: StaticImageData; title: string; price: string }) => {
    return (
        <div className="flex h-[433px] w-[335px] flex-col gap-y-[26px] overflow-hidden rounded-[9.4px] border-2 border-[#F1F1F1] px-[19.47px] py-[9.73px] text-black md:h-[386.88px] md:w-[301.5px] md:gap-y-[23.4px]">
            <div className="flex h-[320px] w-[315.53px] flex-col gap-y-[19.47px] md:h-[284.4px] md:w-[284px] md:gap-y-[17.5px]">
                <div className="flex h-[243px] w-full justify-center pr-4 md:h-[219px]">
                    <Image src={image} alt={title} className="h-full w-[197px] md:w-[177.3px]" />
                </div>
                <div className="flex h-[57.49px] w-auto flex-col gap-y-[6.49px] md:h-[47.8px] md:gap-y-[5.85px]">
                    <div className="h-[30px] w-auto text-xl font-medium leading-[30px] md:h-[24px] md:text-base md:leading-[24px]">
                        {title}
                    </div>
                    <div className="h-[21px] w-auto text-sm font-medium leading-[21px] md:h-[18px] md:text-sm md:leading-[18px]">
                        {price}
                    </div>
                </div>
            </div>
            <div className="md:[44px] flex h-[48px] w-auto gap-x-[16px] md:gap-x-[12px]">
                <Button
                    size="smm"
                    className="flex h-[48px] w-[232px] gap-x-[9.73px] md:h-[44px] md:w-[209px] md:gap-x-[8.77px]"
                >
                    <Image src={Cart} alt="cart" className="h-[19.5px] w-[19.5px] md:h-[17.5px] md:w-[17.5px]" />
                    <div className="h-[24px] w-[95px] font-semibold leading-[24.33px] md:h-[22px] md:w-[85px] md:text-sm md:leading-[21.93px]">
                        Add to Cart
                    </div>
                </Button>
                <Button
                    size={"icon"}
                    className="border-[0.81px] border-gray-3 bg-white hover:bg-slate-50 md:border-[0.73px]"
                >
                    <Image src={Edit} alt="edit" className="h-[19.5px] w-[19.5px] md:h-[17.5px] md:w-[17.5px]" />
                </Button>
            </div>
        </div>
    );
};

export default Card;
