"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../../../assets/Logo.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Google from "../../../assets/google.svg";
import Password from "../../../assets/password.svg";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signUpAction } from "@/serverActions/auth/auth.action";

const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} disabled={pending} className="h-auto w-full py-4">
            {pending ? "Signing Up" : "Signup"}
        </Button>
    );
};

const SignupPage = () => {
    const session = useSession();

    const [state, action] = useFormState(signUpAction, null);

    useEffect(() => {
        if (session.data?.user) {
            redirect("/", RedirectType.replace);
        }
    }, [session]);

    if (state?.success) {
        redirect(`/auth/verify-mail?email=${state.data.email}`, RedirectType.replace);
    }

    return (
        <div className="no-scrollbar flex h-full max-w-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
            <Link href={"/"}>
                <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
            </Link>
            <div className="mx-auto flex h-full w-[25rem] max-w-full flex-col gap-y-5 px-2">
                <div className="flex w-full flex-col gap-y-5">
                    <div className="flex w-full flex-col items-center gap-y-2 text-black">
                        <div className="h-auto w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                            Create your Account
                        </div>
                        <div className="h-auto w-auto text-center leading-[24px] md:leading-[28px]">
                            Create an account to get framing
                        </div>
                    </div>
                    <Button
                        variant={"outline"}
                        className="flex h-auto w-full gap-x-3 overflow-hidden rounded-xl border border-black px-3 py-3"
                        onClick={async () => {
                            await signIn("google");
                        }}
                    >
                        <Image src={Google} alt="google" />
                        <div className="w-auto text-xl font-semibold leading-[30px] text-black">
                            Sign in with Google
                        </div>
                    </Button>
                </div>
                <div className='before:content-["] relative flex w-full select-none justify-center before:absolute before:left-0 before:top-1/2 before:-z-10 before:h-[2px] before:w-full before:bg-black before:bg-opacity-25'>
                    <p className="w-auto bg-white px-3 font-semibold md:text-xl">or</p>
                </div>
                <form action={action} className="flex h-auto w-full flex-col gap-y-5">
                    <div className="flex h-auto w-full flex-col gap-y-2">
                        <div className="flex h-auto w-full flex-col gap-y-3">
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Name">Name</Label>
                                <Input
                                    name="name"
                                    id="Name"
                                    type="text"
                                    required
                                    minLength={3}
                                    className="w-full border p-4"
                                    placeholder="Mail@simple.com"
                                />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Email">Email</Label>
                                <Input
                                    name="email"
                                    id="Email"
                                    type="email"
                                    required
                                    className="w-full border p-4"
                                    placeholder="Mail@simple.com"
                                />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Password">Password</Label>
                                <Input
                                    id="Password"
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    className="w-full border p-4"
                                    placeholder="Min. 8 Characters"
                                />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Confirm Password">Confirm Password</Label>
                                <Input
                                    id="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    className="w-full border p-4"
                                    placeholder="Min. 8 Characters"
                                />
                            </div>
                        </div>
                        {state?.error && <span className="text-red-500">{state.error}</span>}
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-5">
                        <SignUpButton />
                        <div className="flex h-auto w-auto gap-x-2">
                            <div className="leading-auto h-full w-auto text-sm text-black">
                                Already have an account?
                            </div>
                            <Link
                                className="leading-auto h-full w-auto text-sm font-semibold text-blue-1"
                                href={"/auth/login"}
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
