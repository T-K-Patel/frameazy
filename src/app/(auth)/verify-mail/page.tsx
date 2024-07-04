"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../assets/Logo.svg";
import Arrow from "../../../assets/arrow.svg";
import { ArrowLeft } from "lucide-react";

const MailVerify = () => {
    const email = ""; //TODO extract email
    return (
        <div>
            <div className="flex h-auto flex-col gap-y-8 px-5 py-4">
                <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
                <div className="flex h-auto w-auto flex-col gap-y-8">
                    <div className="flex h-auto w-full flex-col gap-y-5">
                        <div className="flex h-auto w-full flex-col items-center gap-y-2 text-black">
                            <div className="h-auto w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                                Verify Your Email
                            </div>
                            <div className="flex h-auto w-auto flex-col gap-y-1 text-center leading-[24px] md:leading-[28px]">
                                To start using Frameazy, Confirm your email address with the we sent to:
                                <span className="h-auto w-auto text-center font-medium">{email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-auto w-full flex-col gap-y-8 pt-2">
                        <div className="flex h-auto w-full flex-col gap-y-8">
                            <Button size={"lg"} className="w-full" onClick={async () => {}}>
                                Open Email App
                            </Button>
                            <div className="flex h-auto w-auto justify-center gap-x-2">
                                <div className="leading-auto h-full w-auto text-sm text-black">
                                    Didn’t receive the email
                                </div>
                                <button
                                    className="leading-auto h-full w-auto text-sm font-semibold text-blue-1"
                                    onClick={() => {}}
                                >
                                    Click to resend
                                </button>
                            </div>
                            <Link className="flex h-auto w-auto justify-center gap-x-3" href="/login">
                                <ArrowLeft />
                                <div className="h-auto w-[155px] font-semibold leading-[24px]">Back to Sign in</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailVerify;
