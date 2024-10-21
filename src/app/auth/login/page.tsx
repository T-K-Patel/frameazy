"use client";
import { signIn, useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../../../assets/Logo.svg";
import { Button } from "@/components/ui/button";
import Google from "../../../assets/google.svg";
import Link from "next/link";
import { Img } from "react-image";

const LoginPage = ({ searchParams }: { searchParams: Record<string, any> }) => {
    const session = useSession();
    const [error, setError] = useState<string | null>(null as string | null);

    useEffect(() => {
        if (session.data?.user) {
            if (searchParams.callbackUrl) {
                redirect(searchParams.callbackUrl, RedirectType.replace);
            } else if (searchParams.next) {
                if (searchParams.next.startsWith("/admin") && session.data.user.role !== "admin") {
                    redirect("/", RedirectType.replace);
                }
                redirect(searchParams.next, RedirectType.replace);
            } else {
                redirect("/", RedirectType.replace);
            }
        }
        setError("");
    }, [session, searchParams]);

    return (
        <div className="no-scrollbar flex h-full flex-col gap-y-5 overflow-y-auto px-5 py-4">
            <Link href={"/"}>
                <Img src={Logo.src} alt="logo" className="md:h-31 md:w-32" />
            </Link>
            <div className="mx-auto flex h-full w-full max-w-[25rem] flex-col gap-y-5 px-2">
                <div className="flex w-full flex-col gap-y-5">
                    <div className="flex w-full flex-col items-center gap-y-2 text-black">
                        <div className="w-auto text-2xl font-semibold leading-[36px] md:text-4xl md:leading-[54px]">
                            Welcome!
                        </div>
                        <div className="w-auto text-center leading-[21px] md:leading-[24px]">
                            Please enter your credentials to access your account
                        </div>
                    </div>
                    <Button
                        variant={"outline"}
                        className="flex h-auto w-full gap-x-3 overflow-hidden rounded-xl border border-black px-3 py-3"
                        onClick={async () => {
                            await signIn("google", { redirect: false });
                        }}
                    >
                        <Img src={Google.src} alt="google" />
                        <div className="w-auto text-xl font-semibold leading-[30px] text-black">
                            Sign in with Google
                        </div>
                    </Button>
                    {error && <span className="m0 w-full text-left text-sm text-red-500">{error}</span>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
