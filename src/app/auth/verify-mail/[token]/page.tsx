"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { act } from "react";
import Logo from "../../../../assets/Logo.svg";
import Arrow from "../../../../assets/arrow.svg";
import { ArrowLeft } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmailAction } from "@/serverActions/auth/auth.action";
import { redirect, RedirectType } from "next/navigation";

const VerifyButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} className="h-auto w-full py-4" disabled={pending} onClick={async () => {}}>
            {pending ? "Verifying" : "Click to Verify Email"}
        </Button>
    );
};

const Page = ({ params, searchParams }: { params: { token: string }; searchParams: any }) => {
    const email = searchParams.email;
    const token = params.token;

    const [state, action] = useFormState(verifyEmailAction, null);

    if (state?.success) {
        redirect("/auth/login", RedirectType.replace);
    }
    return (
        <div>
            <div className="flex flex-col gap-y-8 px-5 py-4">
                <Link href={"/"}>
                    <Image src={Logo} alt="logo" className="md:h-31 md:w-32" />
                </Link>
                <div className="mx-auto flex w-[25rem] max-w-full flex-col gap-y-5">
                    <div className="flex w-full flex-col gap-y-5">
                        <div className="flex w-full flex-col items-center gap-y-2 text-black">
                            <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                                Verify Your Email
                            </div>
                        </div>
                    </div>
                    <form action={action} className="flex w-full flex-col gap-y-4 pt-2">
                        <div className="hidden">
                            <input type="text" name="token" value={token} />
                            <input type="text" name="email" value={email} />
                        </div>
                        <div>{state?.error && <div className="text-red-500">{state.error}</div>}</div>
                        <div className="flex w-full flex-col gap-y-5">
                            <VerifyButton />
                            <div className="flex w-auto justify-center gap-x-2">
                                <div className="leading-auto h-full w-auto text-sm text-black">Link expired?</div>
                                <Button
                                    variant={"link"}
                                    type="button"
                                    className="leading-auto h-full w-auto p-0 text-sm font-semibold text-blue-1"
                                    onClick={() => {}}
                                >
                                    Click to resend
                                </Button>
                            </div>
                            <Link className="flex w-auto justify-center gap-x-3" href="/auth/login">
                                <ArrowLeft />
                                <div className="w-[155px] font-semibold leading-[24px]">Back to Sign in</div>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
