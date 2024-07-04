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

const SignupPage = () => {
    const session = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [match, setMatch] = useState(false);

    useEffect(() => {
        if (session.data?.user) {
            redirect("/", RedirectType.replace);
        }
    }, [session]);

    useEffect(() => {
        if (password === confirmPassword) setMatch(true);
        else {
            setMatch(false);
        }
    }, [confirmPassword]);
    return (
        <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
            <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
            <div className="mx-auto flex h-full max-w-[25rem] flex-col gap-y-5 px-2">
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
                        variant={"light"}
                        className="flex w-full gap-x-3 overflow-hidden rounded-xl border border-black px-3 py-5"
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
                <div className="flex h-auto w-full flex-col gap-y-5">
                    <div className="flex h-auto w-full flex-col gap-y-2">
                        <div className="flex h-auto w-full flex-col gap-y-3">
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Email">Email</Label>
                                <Input
                                    name="Email"
                                    id="Email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    className="w-full border p-4"
                                    placeholder="Mail@simple.com"
                                />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Password">Password</Label>
                                <Input
                                    id="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    className="w-full border p-4"
                                    placeholder="Min. 8 Characters"
                                />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Confirm Password">Confirm Password</Label>
                                <Input
                                    id="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    className="w-full border p-4"
                                    placeholder="Min. 8 Characters"
                                />
                            </div>
                        </div>
                        {!match && (
                            <Link
                                className="h-auto w-auto text-xs font-semibold leading-[21px] text-red-600"
                                href={"/forgotPassword"}
                            >
                                Password does not Match
                            </Link>
                        )}
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-5">
                        <Button
                            size={"lg"}
                            className="w-full"
                            onClick={async () => {
                                signIn("credentials", { email: email, password: password });
                            }}
                        >
                            Signup
                        </Button>
                        <div className="flex h-auto w-auto gap-x-2">
                            <div className="leading-auto h-full w-auto text-sm text-black">
                                Already have an account?
                            </div>
                            <Link
                                className="leading-auto h-full w-auto text-sm font-semibold text-blue-1"
                                href={"/login"}
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
