"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import NextImage from "next/image"
import Upload from "../../assets/upload.svg"
import { Button } from '@/components/ui/button'
import Checkbox from '@/components/Checkbox'

const FramseCategory=["Frame + single mat","Frame + double mats","Picture frames","Collages + single mat","Collages + double mats","Diplomas frames"];
const FrameColors=["Aqua","Barnwood","Black","Blonde burl","Brown","Bronze","Burgundy","Charcoal","Clear Stain","Cherry","Gold","Coffee","Green","Grey","12x12","Honey"];
const Collections=["Natural Wood Collection","Cloaseout pictures frames"];

const AdminDashboard = () => {

  return (
    <section className='w-full h-full flex justify-center'>
        <div className='w-4/5 h-auto flex flex-col gap-y-8 py-[1.5rem]'>
           <h1 className='font-semibold text-3xl/[48px] leading-auto'>Admin Dashboard</h1>
           <div className='w-full h-auto flex flex-col gap-y-11 lg:flex-row lg:gap-x-20'>
            <section className='flex flex-col gap-y-7 w-full'>
                <div className='flex flex-col gap-y-4 w-full'>
                    <div className='flex flex-col gap-y-2'>
                        <Label className='font-semibold text-xl leading-auto'>Product Name</Label>
                        <Input className='w-full h-14' placeholder='Wooden frame'/>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Label className='font-semibold text-xl leading-auto'>Price</Label>
                        <Input className='w-full h-14' placeholder='$1,000,000'/>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Label className='font-semibold text-xl leading-auto'>Product Image</Label>
                        <Label className='cursor-pointer'>
                            <NextImage src={Upload} alt='upload' className='w-[28rem]'/>
                            <Input type='file' accept='image/*' className='hidden' onChange={()=>{}}/>
                        </Label>
                    </div>
                </div>
                <div>
                    `<Button size={"lg"} className='w-full'>Upload</Button>
                </div>
            </section>
            <section className='w-full flex flex-col gap-y-3'>
                <h1 className='w-auto font-semibold text-2xl/10'>Product Attributes</h1>
                <div className='w-full gap-y-12'>
                   <section className='w-full grid grid-cols-2 justify-between'>
                        <div className='flex flex-col gap-y-1 w-auto'>
                            <Label className='font-semibold text-xl leading-auto'>Frames Category</Label>
                            <ul className='flex flex-col gap-y-3 col-span-1'>
                                {FramseCategory.map((item,index)=><Checkbox key={index} title={item}/>)}
                            </ul>
                        </div>
                        <div className='flex flex-col gap-y-1 w-auto'>
                            <Label className='font-semibold text-xl leading-auto'>Frames Colors</Label>
                            <ul className='grid grid-cols-2 justify-between gap-y-2 col-span-1'>
                                {FrameColors.map((item,index)=><Checkbox key={index} title={item}/>)}
                            </ul>
                        </div>
                   </section>
                   <section className='w-full flex justify-between mt-5'>
                        <div className='flex flex-col gap-y-1'>
                            <Label className='font-semibold text-xl leading-auto'>Product size</Label>
                            <ul className='flex flex-col gap-y-5'>
                                <a className='flex gap-x-11 items-center'>
                                    <p>Width:</p>
                                    <div className='flex gap-x-4 items-center'>
                                        <Input className='w-[52px] h-8 rounded-lg overflow-hidden bg-[#F5F4F4] text-center' placeholder="0"/>
                                        <h3 className='font-semibold'>In</h3>
                                    </div>
                                </a>
                                <a className='flex gap-x-10 items-center'>
                                    <p>Height:</p>
                                    <div className='flex gap-x-4 items-center'>
                                        <Input className='w-[52px] h-8 rounded-lg overflow-hidden bg-[#F5F4F4] text-center' placeholder="0"/>
                                        <h3 className='font-semibold align-center'>In</h3>
                                    </div>
                                </a>
                            </ul>    
                        </div>  
                        <div className='flex flex-col gap-y-1'>
                            <Label className='font-semibold text-xl leading-auto'>Collections</Label>
                            <ul className='flex flex-col gap-y-2'>
                                {Collections.map((item,index)=><Checkbox key={index} title={item}/>)}
                            </ul>    
                        </div>  
                   </section>
                </div>
            </section>
           </div>
        </div>
    </section>
  )
}

export default AdminDashboard
