"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import { RedirectType,redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Logo from "../../../assets/Logo.svg"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Arrow from "../../../assets/arrow.svg"
import Link from 'next/link';

const ForgotPage = () => {
    const session=useSession();
    const [email,setEmail]=useState("");
    const [sent,setSent]=useState(false);

    useEffect(()=>{
        if(session.data?.user){
            redirect("/",RedirectType.replace);
        }
    },[session]);

    if(sent){
        return (
            <div className='w-[89%] h-auto px-5 py-4 flex flex-col gap-y-3'>
            <Image src={Logo} alt='logo' className='md:h-31 md:w-32'/>
        <div className='w-auto h-auto flex flex-col gap-y-8'>
            <div className='w-full h-auto flex flex-col gap-y-5'>
                <div className='w-full h-auto flex flex-col gap-y-2 items-center text-black'>
                    <div className='w-auto h-auto font-semibold text-2xl leading-[36px] md:text-4xl md:leading-[54px]'>Check Your Email</div>
                    <div className='w-auto h-auto leading-[24px] text-center md:leading-[28px] flex flex-col gap-y-1'>
                    We have sent a reset link to georgia.young@example.com
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
                        <button className='w-auto h-full font-semibold text-sm leading-auto text-blue-1'>Click to resend</button>
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
        )
    }
  return (
    <div className='w-[89%] h-auto px-5 py-4 flex flex-col gap-y-6'>
      <Image src={Logo} alt='logo' className='md:h-31 md:w-32'/>
      <div className='w-auto h-auto flex flex-col gap-y-8'>
        <div className='w-full h-auto flex flex-col gap-y-5'>
            <div className='w-full h-auto flex flex-col gap-y-2 items-center text-black'>
                <div className='w-auto h-auto font-semibold text-2xl leading-[36px] md:text-4xl md:leading-[54px]'>Forgot Password</div>
                <div className='w-auto h-auto leading-[24px] text-center md:leading-[28px]'>No worries , we’ll send you reset instructions,</div>
            </div>
        </div>
        <div className='w-full h-auto flex flex-col gap-y-8 pt-2'>
            <div className='w-full h-auto flex flex-col gap-y-2'>
                <div className='w-full h-auto flex flex-col gap-y-3'>
                   <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label htmlFor='Email'>Email</Label>
                        <Input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} className='w-full h-[60px] px-[18px] py-[20px] border-[1px]' placeholder='Mail@simple.com'/>
                    </div>
                </div>
            </div>
            <div className='w-full h-auto flex flex-col gap-y-5'>
                <Button size={"lg"} className='w-full' onClick={async()=>{setSent(true)}}>Reset Password</Button>
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
  )
}

export default ForgotPage
