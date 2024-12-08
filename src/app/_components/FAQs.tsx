"use client";
import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";

type AccordionProps = {
	title: string;
	index: number;
	isOpen: boolean;
	data: string;
};

const Accordion = ({ index, title, isOpen, data }: AccordionProps) => {
	return (
		<div className="my-4 border-b-2 border-b-[#f1f1f1]">
			<h2
				className="mb-4 flex w-full cursor-pointer justify-between text-left transition duration-300"
				data-faq-id={index}
			>
				<span className="font-medium md:text-xl">{title}</span>
				{isOpen ? (
					<span
						className={`float-right my-auto transform ${
							isOpen ? "rotate-180" : "rotate-0"
						} transition-transform duration-300`}
					>
						<BiMinus size={24} />
					</span>
				) : (
					<span
						className={`float-right my-auto transform ${
							isOpen ? "rotate-180" : "rotate-0"
						} transition-transform duration-300`}
					>
						<BsPlus size={24} />
					</span>
				)}
			</h2>
			{isOpen && <p className="mb-4">{data}</p>}
		</div>
	);
};

const FAQData = [
	{
		title: "How do I get started with customizing my frames?",
		data: `Getting started is easy! Simply click on the "Design Your Frame" button, and you'll be guided through our user-friendly customization tool. Choose your frame style, size, artwork theme, and personalization options to create the perfect frame for your needs`,
	},
	{
		title: "Can I upload my own artwork or photos for framing?",
		data: `Yes, you can! We offer the option to upload your own artwork or photos during the customization process. This way, you can turn your treasured memories or original artwork into beautiful framed pieces.`,
	},
	{
		title: "What types of frames do you offer?",
		data: `We provide a diverse selection of frame styles, including traditional, modern, rustic, and more. You can explore our range in the customization tool to find the perfect frame to complement your artwork or photos.`,
	},
	{
		title: "How can I reach your customer support team?",
		data: `If you have any questions, concerns, or need assistance, please don't hesitate to contact our customer support team. You can reach us through the "Contact Us" section of our website, and we'll be happy to assist you.`,
	},
	{
		title: "What if I'm not satisfied with my order?",
		data: `Your satisfaction is important to us. If you're not completely satisfied with your order, please contact our customer support team, and we'll work with you to address any issues or concerns.`,
	},
];

const FAQ = () => {
	const [activeInd, setActiveIndex] = useState(-1);

	const toogleFAQ: React.MouseEventHandler<HTMLDivElement> = (e) => {
		let target = e.target as HTMLElement;
		while (target && target.tagName !== "H2") {
			target = target.parentNode as HTMLElement;
		}
		if (target && target.tagName === "H2") {
			const dataInfo = Number(target.getAttribute("data-faq-id"));
			if (!isNaN(dataInfo)) {
				setActiveIndex(dataInfo == activeInd ? -1 : dataInfo);
			}
		}
	};

	return (
		<div className="mx-auto mt-10 w-5/6 max-w-screen-2xl max-md:w-11/12 lg:mt-16">
			<h2 className="mb-6 text-center text-xl font-semibold md:text-3xl lg:text-[40px]">
				Frequently Asked Questions
			</h2>
			<div className="flex flex-col gap-4" onClick={toogleFAQ}>
				{FAQData.map((faq, index) => (
					<Accordion
						key={index}
						index={index}
						title={faq.title}
						data={faq.data}
						isOpen={index == activeInd}
					/>
				))}
			</div>
		</div>
	);
};

export default FAQ;
