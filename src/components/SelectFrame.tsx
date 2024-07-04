"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { BsArrowRight } from 'react-icons/bs'
import { DialogContent,Dialog,DialogTrigger } from './ui/dialog'
import Image from 'next/image'
import Upload from "../assets/uploadImage.svg"
import Empty from "../assets/empty.svg"
import Mirror from "../assets/mirror.svg"
import Canvas from "../assets/canvas.svg"
import Paper from "../assets/paper.svg"

const SelectFrame = () => {
    const SelectStyle=()=>{
        return (
         <div className='w-auto h-auto flex flex-col gap-y-10 items-center'>
             <div className='w-auto h-auto gap-y-4 items-center'>
                 <div className='font-semibold text-3xl leading-12 text-center'>Select your style of frame </div>
                 <div className='lg:text-xl leading-[30px]'>Welcome to frame selection, choose the style that best suits your taste and needs</div>
             </div>
             <div className='gap-5 md:flex'>
                 <button className='border-[#F1F1F1] p-6 gap-4'>
                     <div className='font-semibold leading-6'>Upload and frame an image</div>
                     <Image src={Upload} alt='upload'/>
                 </button>
                 <button className='border-[#F1F1F1] p-6 gap-4' onClick={()=>{setContent(<EmptyFrame/>)}}>
                     <div className='font-semibold leading-6'>Upload and frame an image</div>
                     <Image src={Empty} alt='empty'/>
                 </button>
                 <button className='border-[#F1F1F1] p-6 gap-4'>
                     <div className='font-semibold leading-6'>Upload and frame an image</div>
                     <Image src={Mirror} alt='mirror'/>
                 </button>
             </div>
         </div>
        )
     }

     const EmptyFrame=()=>{
        return (
             <div className='px-50 py-20'>
                <div className='flex flex-col gap-10'>
                    <div className='flex flex-col gap-4 items-center'>
                        <div className='font-semibold text-3xl leading-12'>Please select the type of frame you want to create</div>
                        <div className='lg:text-xl leading-[30px]'>Choose the type of  empty frame your want to create </div>
                    </div>
                    <div className='flex gap-5'>
                        <div className='border-[#F1F1F1] p-6 gap-4'>
                            <div className='font-semibold leading-6'>Empty frame for canvas or panel</div>
                            <Image src={Canvas} alt='canvas'/>
                        </div>
                        <div className='border-[#F1F1F1] p-6 gap-4'>
                            <div className='font-semibold leading-6'>Empty frame for paper item</div>
                            <Image src={Paper} alt='paper'/>
                        </div>
                    </div>
                </div>
             </div>
        )
    }
     
    const [content,setContent]=useState(<SelectStyle/>)
  return (
    <Dialog>
        <DialogTrigger>
            <Button
                size={"sm"}
                variant={"light"}
                className="mt-8 h-min w-min px-8 py-4 text-xl font-semibold transition-all duration-200 active:scale-90"
            >
                Start Framing
                <BsArrowRight />
            </Button>
        </DialogTrigger>
        <DialogContent className='w-[85%] h-auto px-10 py-20'>
            {content}
        </DialogContent>
    </Dialog>
  )
}

export default SelectFrame
