"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import { RedirectType,redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Logo from "../../../../assets/Logo.svg"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Arrow from "../../../../assets/arrow.svg"
import Link from 'next/link';

const NewPassword = () => {
    const session=useSession();
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [match,setMatch]=useState(false);
    const [success,setSuccess]=useState(false);

    useEffect(()=>{
        if(session.data?.user){
            redirect("/",RedirectType.replace);
        }
    },[session]);

    useEffect(()=>{
        if(password===confirmPassword)setMatch(true);
        else{setMatch(false)}
    },[confirmPassword]);

    if(success)return (
        <div className='w-[89%] h-auto px-5 py-4 flex flex-col gap-y-6'>
      <Image src={Logo} alt='logo' className='md:h-31 md:w-32'/>
      <div className='w-auto h-auto flex flex-col gap-y-8'>
        <div className='w-full h-auto flex flex-col gap-y-5'>
            <div className='w-full h-auto flex flex-col gap-y-2 items-center text-black'>
                <div className='w-auto h-auto font-semibold text-2xl leading-[36px] md:text-4xl md:leading-[54px]'>Password Reset</div>
                <div className='w-auto h-auto leading-[24px] text-center md:leading-[28px]'>Your password has been successfully reset. 
                Click below to Sign in magically</div>
            </div>
        </div>
        <div className='w-full h-auto flex flex-col gap-y-8 pt-2'>
            <div className='w-full h-auto flex flex-col gap-y-8'>
                <Link href={"/"}>
                    <Button size={"lg"} className='w-full'>Continue</Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
    )
  return (
    <div className='w-[89%] h-auto px-5 py-4 flex flex-col gap-y-6'>
      <Image src={Logo} alt='logo' className='md:h-31 md:w-32'/>
      <div className='w-auto h-auto flex flex-col gap-y-8'>
        <div className='w-full h-auto flex flex-col gap-y-5'>
            <div className='w-full h-auto flex flex-col gap-y-2 items-center text-black'>
                <div className='w-auto h-auto font-semibold text-2xl leading-[36px] md:text-4xl md:leading-[54px]'>Set New Password</div>
                <div className='w-auto h-auto leading-[24px] text-center md:leading-[28px]'>Your new password must be different from your previously used password</div>
            </div>
        </div>
        <div className='w-full h-auto flex flex-col gap-y-8 pt-2'>
            <div className='w-full h-auto flex flex-col gap-y-2'>
                <div className='w-full h-auto flex flex-col gap-y-3'>
                   <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} className='w-full h-[60px] px-[18px] py-[20px] border-[1px]' placeholder='Mail@simple.com'/>
                    </div>
                   <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label htmlFor='confirmPassword'>Password</Label>
                        <Input type="text" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} className='w-full h-[60px] px-[18px] py-[20px] border-[1px]' placeholder='Mail@simple.com'/>
                    </div>
                </div>
                {!match&&<Link className='w-auto h-auto font-semibold text-xs leading-[21px] text-red-600' href={"/forgotPassword"}>Password does not Match</Link>}
            </div>
            <div className='w-full h-auto flex flex-col gap-y-8'>
                <Button size={"lg"} className='w-full' onClick={async()=>{setSuccess(true)}}>Confirm</Button>
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

export default NewPassword
