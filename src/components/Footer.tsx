"use client";
import { BsFacebook, BsInstagram, BsTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaEnvelope, FaLocationDot } from "react-icons/fa6";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { subscribeNewsLetterAction } from "@/serverActions/subscribe-news-letter";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Img } from "react-image";

const SubscribeButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            size={"lg"}
            className="h-12 w-max rounded-l-none p-4 px-8 uppercase max-xs:w-full lg:h-14"
            disabled={pending}
            onClick={() => {}}
        >
            Subscribe
        </Button>
    );
};

const Footer = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, action] = useFormState(subscribeNewsLetterAction, null);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            alert(state.data);
            formRef.current?.reset();
        } else {
            alert(state.error);
        }
    }, [state]);

    return (
        <footer className="mx-auto max-w-screen-2xl">
            <div className="mx-auto mt-20 w-11/12">
                <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold md:text-4xl">Join our Newsletter</h2>
                        <p className="pt-2 font-light md:text-xl">
                            We’ll send you a nice letter once per week. No spam
                        </p>
                    </div>
                    <form
                        ref={formRef}
                        action={action}
                        className="flex w-fit overflow-hidden rounded-xl bg-black bg-opacity-[0.1] max-md:w-full max-xs:flex-col"
                    >
                        <input
                            type="email"
                            required
                            name="email"
                            placeholder="Enter your email"
                            className="h-12 w-full bg-transparent px-5 py-4 outline-none md:w-fit lg:h-14"
                        />
                        <SubscribeButton />
                    </form>
                </div>
                <div className="my-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
                    <div className="flex flex-1 flex-col gap-5">
                        <div className="flex gap-3">
                            <FaLocationDot size={24} />
                            <p className="md:text-xl">3517 W. Gray St. Utica</p>
                        </div>
                        <div className="flex gap-3">
                            <FaEnvelope size={24} />
                            <p className="md:text-xl">Frameazy@mail.co</p>
                        </div>
                        <div className="flex gap-3">
                            <BsTelephoneFill size={24} />
                            <p className="md:text-xl">(+33)7 65 55 72 67</p>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col md:items-end">
                        <h3 className="mb-4 text-xl font-bold md:text-2xl">Our Social media</h3>
                        <div className="flex gap-6">
                            <Link href={"https://instagram.com/"} target="_blank">
                                <Button size={"icon"} className="rounded-md text-white">
                                    <BsInstagram size={20} />
                                </Button>
                            </Link>
                            <Link href={"https://facebook.com/"} target="_blank">
                                <Button size={"icon"} className="rounded-md text-white">
                                    <BsFacebook size={20} />
                                </Button>
                            </Link>
                            <Link href={"https://twitter.com/"} target="_blank">
                                <Button size={"icon"} className="rounded-md text-white">
                                    <BsTwitter size={20} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto w-11/12 border-t-2 border-solid border-[#f1f1f1]">
                <div className="mx-auto flex flex-col justify-start gap-5 py-9 font-semibold md:flex-row md:justify-between">
                    <p>&copy;{new Date().getFullYear()} Copyright by Frameazy</p>
                    <Img src={"@/assets/frameasy-logo.png"} alt="logo" loading="lazy" className="w-36" />
                    <p>Terms, Privacy policy</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
