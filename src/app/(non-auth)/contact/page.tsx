"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from "react-dom";
import { contactUsAction } from "@/serverActions/contact-us";

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button size={"lg"} className="h-auto w-full py-3 text-lg" type="submit" disabled={pending}>
			{pending ? "Submitting..." : "Submit"}
		</Button>
	);
};

const ContactPage = () => {
	const formRef = useRef<HTMLFormElement>(null);

	const [state, action] = useFormState(contactUsAction, null);

	useEffect(() => {
		if (state?.success) {
			formRef.current?.reset();
		}
	}, [state]);

	return (
		<section className="mx-auto flex h-auto max-w-screen-2xl flex-col gap-y-4 px-0">
			<div className="mx-auto flex h-auto w-11/12 flex-col gap-y-2">
				<div className="mx-auto flex h-auto flex-col gap-y-2 p-5">
					<h1 className="h-auto pb-3 text-2xl font-semibold leading-[36px] md:text-3xl/8 md:leading-[48px]">
						Our Story
					</h1>
					<p className="text-justify">
						At Frameazy, our journey began with a simple frustration. Joy Sharma, founder of Frameazy,
						inspired by a love for preserving memories and enhancing home décor, struggled to find quality
						frames that didn’t break the bank. After countless trips to stores that offered either
						overpriced options or lackluster quality, he realized there had to be a better way.
					</p>
					<p className="text-justify">
						Determined to change the framing experience, he set out to create a business that would
						prioritize both craftsmanship and affordability. With a vision to help others showcase their
						most cherished moments, Frameazy was born. We believe every photo deserves a beautiful frame
						that reflects its significance. Our mission is to provide high-quality, custom framing solutions
						that make it easy for you to display what matters most. With a commitment to exceptional
						craftsmanship and customer satisfaction, we’re here to help you create frames that you’ll
						cherish for years to come. Join us on this journey, and let’s turn your memories into art
						together!
					</p>
				</div>
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
								<Label htmlFor="cu-name">Name *</Label>
								<Input
									id="cu-name"
									maxLength={100}
									placeholder="Jane doe"
									name="name"
									type="text"
									className="w-full p-4"
									required
								/>
							</div>
							<div className="flex h-auto w-full flex-col gap-y-2">
								<Label htmlFor="cu-email">Email *</Label>
								<Input
									id="cu-email"
									maxLength={100}
									placeholder="Mail@simple.com"
									name="email"
									type="email"
									className="w-full p-4"
									required
								/>
							</div>
							<div className="flex h-auto w-full flex-col gap-y-2">
								<Label htmlFor="cu-message">Message *</Label>
								<Textarea
									id="cu-message"
									name="message"
									placeholder="Your message goes here"
									className="w-full p-4 md:p-4"
									rows={5}
									required
									maxLength={1000}
								/>
							</div>
							{state?.success == false && (
								<div className="flex h-auto w-full flex-col gap-y-2">
									<span className="text-red-500">{state.error}</span>
								</div>
							)}
							{state?.success && (
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
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1641.4091381059002!2d72.83321327460479!3d19.065154768106584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91140262913%3A0xc53b6407e4d39f76!2sMakhija%20Arcade%2C%2035th%20Rd%2C%20Khar%2C%20Khar%20West%2C%20Mumbai%2C%20Maharashtra%20400052!5e0!3m2!1sen!2sin!4v1729875578501!5m2!1sen!2sin"
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
