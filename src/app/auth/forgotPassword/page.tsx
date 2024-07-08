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
import { useFormState, useFormStatus } from "react-dom";
import { forgotPasswordSendMailAction } from "@/serverActions/auth/auth.action";

const SendResetLinkButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} disabled={pending} className="h-auto w-full py-4">
            {pending ? "Sending" : "Send Reset Link"}
        </Button>
    );
};

const ForgotPage = () => {
    const session = useSession();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const [state, action] = useFormState(forgotPasswordSendMailAction, null);

    useEffect(() => {
        if (session.data?.user) {
            redirect("/", RedirectType.replace);
        }
    }, [session]);

    useEffect(() => {
        if (state?.success) {
            setSent(true);
            setEmail(state.data.email);
        }
    }, [state]);

    if (sent) {
        return (
            <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
                <Link href={"/"}>
                    <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
                </Link>
                <div className="mx-auto flex h-full max-w-[25rem] flex-col gap-y-5 px-2">
                    <div className="flex w-full flex-col gap-y-5">
                        <div className="flex w-full flex-col items-center gap-y-2 text-black">
                            <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                                Check Your Email
                            </div>
                            <div className="flex h-auto w-auto flex-col gap-y-1 text-center leading-[24px] md:leading-[28px]">
                                We have sent a reset link to
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
        );
    }
    return (
        <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
            <Link href={"/"}>
                <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
            </Link>
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
                <form action={action} className="flex h-auto w-full flex-col gap-y-4 pt-2">
                    <div className="flex h-auto w-full flex-col gap-y-2">
                        <div className="flex h-auto w-full flex-col gap-y-3">
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label htmlFor="Email">Email</Label>
                                <Input
                                    id="Email"
                                    type="text"
                                    name="email"
                                    className="w-full border p-4"
                                    placeholder="Mail@simple.com"
                                />
                            </div>
                        </div>
                    </div>
                    {state?.success == false && <div className="text-red-500">{state.error}</div>}
                    <div className="flex h-auto w-full flex-col gap-y-5">
                        <SendResetLinkButton />
                        <Link className="flex h-auto w-auto justify-center gap-x-3" href="/auth/login">
                            <ArrowLeft />
                            <div className="h-auto w-[155px] font-semibold leading-[24px]">Back to Sign in</div>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPage;
