"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../../../../assets/Logo.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Arrow from "../../../../assets/arrow.svg";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NewPassword = () => {
    const session = useSession();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (session.data?.user) {
            redirect("/", RedirectType.replace);
        }
    }, [session]);

    if (success)
        return (
            <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
                <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
                <div className="mx-auto flex h-full max-w-[25rem] flex-col gap-y-5 px-2">
                    <div className="flex w-full flex-col gap-y-5">
                        <div className="flex w-full flex-col items-center gap-y-2 text-black">
                            <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                                Password Reset
                            </div>
                            <div className="h-auto w-auto text-center leading-[24px] md:leading-[28px]">
                                Your password has been successfully reset. Click below to Sign in magically
                            </div>
                        </div>
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-8 pt-2">
                        <div className="flex h-auto w-full flex-col gap-y-8">
                            <Link href={"/"}>
                                <Button size={"lg"} className="w-full">
                                    Continue
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    return (
        <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
            <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
            <div className="mx-auto flex h-full max-w-[25rem] flex-col gap-y-5 px-2">
                <div className="flex w-full flex-col gap-y-5">
                    <div className="flex w-full flex-col items-center gap-y-2 text-black">
                        <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                            Set New Password
                        </div>
                        <div className="h-auto w-auto text-center leading-[24px] md:leading-[28px]">
                            Your new password must be different from your previously used password
                        </div>
                    </div>
                </div>
                <div className="flex h-auto w-full flex-col gap-y-8 pt-2">
                    <div className="flex h-auto w-full flex-col gap-y-2">
                        <div className="flex h-auto w-full flex-col gap-y-3">
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    className="h-[60px] w-full border-[1px] px-[18px] py-[20px]"
                                    placeholder="Mail@simple.com"
                                />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="text"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    className="h-[60px] w-full border-[1px] px-[18px] py-[20px]"
                                    placeholder="Mail@simple.com"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-8">
                        <Button
                            size={"lg"}
                            className="w-full"
                            onClick={async () => {
                                setSuccess(true);
                            }}
                        >
                            Confirm
                        </Button>
                        <Link className="flex h-auto w-auto justify-center gap-x-3" href="/auth/login">
                            <ArrowLeft />
                            <div className="h-auto w-[155px] font-semibold leading-[24px]">Back to Sign in</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
