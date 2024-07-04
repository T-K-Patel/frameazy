"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useRef } from "react";
import Contact from "@/assets/contact.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from "react-dom";
import { contactUsAction } from "@/serverActions/contact-us";

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} className="w-full" type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Submit"}
        </Button>
    );
};

const ContactPage = () => {
    const formRef = useRef<HTMLFormElement>(null);

    const [state, action] = useFormState(contactUsAction, null);

    if (state?.data) {
        formRef.current?.reset();
    }

    return (
        <section className="mx-auto flex h-auto max-w-screen-2xl flex-col gap-y-4 px-0">
            <div
                className="py-24 md:py-32"
                style={{
                    backgroundImage: `url(${Contact.src})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <h1 className="text-center text-4xl font-bold text-white md:text-6xl">Contact Us</h1>
            </div>
            <div className="mx-auto grid w-11/12 py-6 md:grid-cols-2">
                <div className="mx-auto flex h-auto w-11/12 flex-col gap-y-10">
                    <h1 className="w-90 h-auto text-2xl font-semibold leading-[36px] md:text-3xl/8 md:leading-[48px]">
                        Love to hear from you,
                        <br /> Get in touch
                    </h1>
                    <form ref={formRef} action={action} className="flex h-auto w-full flex-col gap-y-7">
                        <div className="flex h-auto w-full flex-col gap-y-4">
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label>Name *</Label>
                                <Input placeholder="Jane doe" type="text" className="w-full p-4" required />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label>Email *</Label>
                                <Input placeholder="Mail@simple.com" type="email" className="w-full p-4" required />
                            </div>
                            <div className="flex h-auto w-full flex-col gap-y-2">
                                <Label>Message *</Label>
                                <Textarea
                                    placeholder="Your message goes here"
                                    className="w-full p-4 md:p-4"
                                    rows={5}
                                    required
                                />
                            </div>
                            {state?.error && (
                                <div className="flex h-auto w-full flex-col gap-y-2">
                                    <span className="text-red-500">{state.error}</span>
                                </div>
                            )}
                            {state?.data && (
                                <div className="flex h-auto w-full flex-col gap-y-2">
                                    <span className="text-green-500">{state.data}</span>
                                </div>
                            )}
                        </div>
                        <SubmitButton />
                    </form>
                </div>
                <div className="flex items-center justify-end p-5">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7310705.282272247!2d68.5844335014852!3d26.530404211858755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396a3efaf7e30e37%3A0xb52b9b4506c088e5!2sRajasthan!5e0!3m2!1sen!2sin!4v1720096416411!5m2!1sen!2sin"
                        className="aspect-square w-full"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
