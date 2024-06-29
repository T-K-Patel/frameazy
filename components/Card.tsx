import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Cart from "../assets/cart.svg"
import Edit from "../assets/edit-2.svg"

const Card = ({image,title,price}:{image:StaticImageData,title:string,price:string}) => {
  return (
    <div className='w-[335px] h-[433px] rounded-[9.4px] overflow-hidden border-2 border-[#F1F1F1] px-[19.47px] py-[9.73px] flex flex-col gap-y-[26px] text-black md:w-[301.5px] md:h-[386.88px] md:gap-y-[23.4px]'>
      <div className='w-[315.53px] h-[320px] flex flex-col gap-y-[19.47px] md:w-[284px] md:h-[284.4px] md:gap-y-[17.5px]'>
        <div className='w-full h-[243px] flex justify-center md:h-[219px] pr-4'>
            <Image src={image} alt={title} className='w-[197px] h-full md:w-[177.3px]'/>
        </div>
        <div className='w-auto h-[57.49px] flex flex-col gap-y-[6.49px] md:h-[47.8px] md:gap-y-[5.85px]'>
            <div className='w-auto h-[30px] font-medium text-xl leading-[30px] md:h-[24px] md:text-base md:leading-[24px]'>
                {title}
            </div>
            <div className='w-auto h-[21px] font-medium text-sm leading-[21px] md:h-[18px] md:text-sm md:leading-[18px]'>
                {price}
            </div>
        </div>
      </div>
      <div className='w-auto h-[48px] flex gap-x-[16px] md:[44px] md:gap-x-[12px]'>
        <Button size="smm" className="w-[232px] h-[48px] flex gap-x-[9.73px] md:w-[209px] md:h-[44px] md:gap-x-[8.77px]">
            <Image src={Cart} alt='cart' className='w-[19.5px] h-[19.5px] md:h-[17.5px] md:w-[17.5px]'/>
            <div className='w-[95px] h-[24px] font-semibold leading-[24.33px] md:w-[85px] md:h-[22px] md:text-sm md:leading-[21.93px]'>
                Add to Cart
            </div>
        </Button>
        <Button size={"icon"} className='border-gray-3 border-[0.81px] md:border-[0.73px] bg-white hover:bg-slate-50'>
            <Image src={Edit} alt='edit' className='w-[19.5px] h-[19.5px] md:h-[17.5px] md:w-[17.5px]'/>
        </Button>
      </div>
    </div>
  )
}

export default Card
