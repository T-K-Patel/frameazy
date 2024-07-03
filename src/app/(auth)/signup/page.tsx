"use client"
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image';
import { RedirectType,redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Logo from "../../../assets/Logo.svg"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Google from "../../../assets/google.svg"
import Password from "../../../assets/password.svg"
import Link from 'next/link';

const SignupPage = () => {
    const session=useSession();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [match,setMatch]=useState(false);

    useEffect(()=>{
        if(session.data?.user){
            redirect("/",RedirectType.replace);
        }
    },[session]);

    useEffect(()=>{
        if(password===confirmPassword)setMatch(true);
        else{setMatch(false)}
    },[confirmPassword])
  return (
    <div className='w-[89%] h-auto px-5 py-4 flex flex-col gap-y-5'>
        <Image src={Logo} alt='logo' className='md:h-31 md:w-32'/>
      <div className='w-auto h-auto flex flex-col gap-y-8'>
        <div className='w-full h-auto flex flex-col gap-y-5'>
            <div className='w-full h-auto flex flex-col gap-y-2 items-center text-black'>
                <div className='w-auto h-auto font-semibold text-2xl leading-[36px] md:text-4xl md:leading-[54px]'>Create your Account</div>
                <div className='w-auto h-auto leading-[24px] text-center md:leading-[28px]'>Create an account to get framing</div>
            </div>
            <Button variant={"light"} className='w-full h-[60px] rounded-[12px] overflow-hidden border-[1px] px-3 py-5 flex gap-x-3 border-black' onClick={async()=>{await signIn("google")}}>
                <Image src={Google} alt='google'/>
                <div className='w-auto h-auto font-semibold text-xl leading-[30px] text-black'>
                    Sign up with Google
                </div>
            </Button>
        </div>
        <div className='w-full h-auto flex justify-center gap-x-3'>
            <div className='w-auto h-auto font-semibold md:text-xl md:leading-[30px]'>or</div>
        </div>
        <div className='w-full h-auto flex flex-col gap-y-8'>
            <div className='w-full h-auto flex flex-col gap-y-2'>
                <div className='w-full h-auto flex flex-col gap-y-3'>
                   <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label htmlFor='Email'>Email</Label>
                        <Input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} className='w-full h-[60px] px-[18px] py-[20px] border-[1px]' placeholder='Mail@simple.com'/>
                    </div> 
                   <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label htmlFor='Password'>Password</Label>
                        <Input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='w-full h-[60px] px-[18px] py-[20px] border-[1px] items-end' placeholder='Min. 8 Characters'/>
                    </div> 
                   <div className='w-full h-auto flex flex-col gap-y-2'>
                        <Label htmlFor='Confirm Password'>Confirm Password</Label>
                        <Input type='password' value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} className='w-full h-[60px] px-[18px] py-[20px] border-[1px] items-end' placeholder='Min. 8 Characters'/>
                    </div> 
                </div>
                {!match&&<Link className='w-auto h-auto font-semibold text-xs leading-[21px] text-red-600' href={"/forgotPassword"}>Password does not Match</Link>}
            </div>
            <div className='w-full h-auto flex flex-col gap-y-5'>
                <Button size={"lg"} className='w-full' onClick={async()=>{signIn("credentials",{email:email,password:password})}}>Signup</Button>
                <div className='w-auto h-auto flex gap-x-2'>
                    <div className='w-auto h-full text-sm leading-auto text-black'>
                    Already have an account? 
                    </div>
                    <Link className='w-auto h-full font-semibold text-sm leading-auto text-blue-1' href={"/login"}>Sign In</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
