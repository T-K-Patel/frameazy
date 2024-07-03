"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from "../../../assets/Logo.svg"
import Arrow from "../../../assets/arrow.svg"

const MailVerify = () => {
    const email="";//TODO extract email
  return (
    <div>
      <div className='w-[89%] h-auto px-5 py-4 flex flex-col gap-y-8'>
            <Image src={Logo} alt='logo' className='md:h-31 md:w-32'/>
        <div className='w-auto h-auto flex flex-col gap-y-8'>
            <div className='w-full h-auto flex flex-col gap-y-5'>
                <div className='w-full h-auto flex flex-col gap-y-2 items-center text-black'>
                    <div className='w-auto h-auto font-semibold text-2xl leading-[36px] md:text-4xl md:leading-[54px]'>Verify Your Email</div>
                    <div className='w-auto h-auto leading-[24px] text-center md:leading-[28px] flex flex-col gap-y-1'>
                    To start using Frameazy, Confirm your email address with the we sent to:
                    <span className='w-auto h-auto font-medium text-center'>{email}</span>
                    </div>
                </div>
            </div>
            <div className='w-full h-auto flex flex-col gap-y-8 pt-2'>
                <div className='w-full h-auto flex flex-col gap-y-8'>
                    <Button size={"lg"} className='w-full' onClick={async()=>{}}>Open Email App</Button>
                    <div className='w-auto h-auto flex gap-x-2 justify-center'>
                        <div className='w-auto h-full text-sm leading-auto text-black'>
                            Didn’t receive the email 
                        </div>
                        <button className='w-auto h-full font-semibold text-sm leading-auto text-blue-1' onClick={()=>{}}>Click to resend</button>
                    </div>
                    <Link className='w-auto h-auto flex justify-center gap-x-3' href="/login">
                        <Image src={Arrow} alt='back'/>
                        <div className='w-[155px] h-auto font-semibold leading-[24px]'>
                            Back to Sign in
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default MailVerify