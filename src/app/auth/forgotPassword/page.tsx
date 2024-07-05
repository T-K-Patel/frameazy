"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../../../assets/Logo.svg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ForgotPage = () => {
    const session = useSession();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (session.data?.user) {
            redirect("/", RedirectType.replace);
        }
    }, [session]);

    if (sent) {
        return (
            <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
                <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
                <div className="mx-auto flex h-full max-w-[25rem] flex-col gap-y-5 px-2">
                    <div className="flex w-full flex-col gap-y-5">
                        <div className="flex w-full flex-col items-center gap-y-2 text-black">
                            <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                                Check Your Email
                            </div>
                            <div className="flex h-auto w-auto flex-col gap-y-1 text-center leading-[24px] md:leading-[28px]">
                                We have sent a reset link to georgia.young@example.com
                                <span className="h-auto w-auto text-center font-medium">{email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-8 pt-2">
                        <div className="flex h-auto w-full flex-col gap-y-8">
                            <Button
                                size={"lg"}
                                className="w-full"
                                onClick={async () => {
                                    window.open("https://gmail.com");
                                }}
                            >
                                Open Email App
                            </Button>
                            <div className="flex h-auto w-auto justify-center gap-x-2">
                                <div className="leading-auto h-full w-auto text-sm text-black">
                                    Didn’t receive the email
                                </div>
                                <button className="leading-auto h-full w-auto text-sm font-semibold text-blue-1">
                                    Click to resend
                                </button>
                            </div>
                            <Link className="flex h-auto w-auto justify-center gap-x-3" href="/auth/login">
                                <ArrowLeft />
                                <div className="h-auto w-[155px] font-semibold leading-[24px]">Back to Sign in</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
            <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
            <div className="mx-auto flex h-full max-w-[25rem] flex-col gap-y-5 px-2">
                <div className="flex w-full flex-col gap-y-5">
                    <div className="flex w-full flex-col items-center gap-y-2 text-black">
                        <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                            Forgot Password
                        </div>
                        <div className="h-auto w-auto text-center leading-[24px] md:leading-[28px]">
                            No worries , we’ll send you reset instructions,
                        </div>
                    </div>
                </div>
                <div className="flex h-auto w-full flex-col gap-y-8 pt-2">
                    <div className="flex h-auto w-full flex-col gap-y-2">
                        <div className="flex h-auto w-full flex-col gap-y-3">
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Email">Email</Label>
                                <Input
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
                        </div>
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-5">
                        <Button
                            size={"lg"}
                            className="w-full"
                            onClick={async () => {
                                setSent(true);
                            }}
                        >
                            Reset Password
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

export default ForgotPage;
