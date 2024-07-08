"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../assets/Logo.svg";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

const Page = ({ searchParams }: { searchParams: any }) => {
    const email = searchParams.email; //TODO extract email
    if (!email) redirect("/auth/login");
    return (
        <div>
            <div className="flex h-auto flex-col gap-y-8 px-5 py-4">
                <Link href={"/"}>
                    <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
                </Link>
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
                            <Button
                                size={"lg"}
                                className="h-auto w-full py-4"
                                onClick={async (e) => {
                                    const button = e.currentTarget;
                                    button.disabled = true;
                                    button.innerText = "Sending...";
                                    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate resend email //TODO: implement serveraction to resend email
                                    button.innerText = "Resend Email (60s)";
                                    console.log("Resend email");
                                    const interval = setInterval(() => {
                                        if (button.innerText === "Resend Email (1s)") {
                                            clearInterval(interval);
                                            button.disabled = false;
                                            button.innerText = "Resend Email";
                                        } else {
                                            button.innerText = button.innerText.replace(/\d+/, (match) => {
                                                return String(Number(match) - 1);
                                            });
                                        }
                                    }, 1000);
                                }}
                            >
                                Resend Email
                            </Button>
                            <Link className="flex h-auto w-auto justify-center gap-x-3" href="/auth/login">
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

export default Page;
