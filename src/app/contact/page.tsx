"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React from 'react'
import {useForm} from "react-hook-form"
import Contact from "../../assets/contact.png"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ContactPage = () => {
    const {
        register,
        handleSubmit,
        formState:{errors}
    }=useForm();

    const onSubmit=(data:any)=>{
        console.log(data);
    }
  return (
    <div className='w-[89%] h-auto px-2 flex flex-col gap-y-4'>
      <Image src={Contact} alt='contact' className='w-full h-auto'/>
      <div className='w-full h-auto flex flex-col gap-y-10 md:flex-row md:gap-x-10'>
        <div className='w-full h-auto flex flex-col gap-y-10'>
            <div className='w-90 h-auto font-semibold text-2xl leading-[36px] md:text-3xl/8 md:leading-[48px]'>
                Love to hear from you, Get in touch
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full h-auto flex flex-col gap-y-10'>
                <div className='w-full h-auto flex flex-col gap-y-4'>
                    <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label>Name</Label>
                        <Input placeholder='Jane doe' type='text' {...register("name")} className='w-full h-[60px]'/>
                    </div>
                    <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label>Email</Label>
                        <Input placeholder='Mail@simple.com' type='text' {...register("email")} className='w-full h-[60px]'/>
                    </div>
                    <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label>Message</Label>
                        <Input placeholder='Your message goes here' type='text' {...register("message")} className='w-full h-[122px] md:h-[180px]'/>
                    </div>
                </div>
                <Button size={"lg"} className='w-full' type='submit'>Send</Button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
