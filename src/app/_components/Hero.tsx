"use client";
import React from "react";
import heroImage from "@/assets/Hero.jpg";
import { Button } from "@/components/ui/button";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import { useDialog } from "@/context/DialogContext";

function Hero() {
	const { openDialog } = useDialog();
	return (
		<>
			<section className="bg-blue-1">
				<div className="mx-auto flex h-full max-w-screen-2xl flex-col gap-5 overflow-hidden md:max-h-screen md:flex-row">
					<div className="mx-5 my-10 flex flex-1 flex-col items-start justify-center text-white sm:mx-10 md:mx-0 md:my-0 md:ml-14 lg:ml-20">
						<h1 className="pb-5 text-4xl font-bold lg:text-5xl">
							Frame Your Imagination – Design with Frameazy
						</h1>
						<p>
							Welcome to Frameazy – your ultimate destination for custom framing that transforms your
							memories into masterpieces! Whether you want to highlight beloved family photos, showcase
							stunning artwork, or celebrate unforgettable travel moments, we make it effortless to find
							the perfect frame that enhances your unique style and décor. Let us help you turn your
							memories into art that speaks to your heart!
						</p>
						{/* TODO: Use Shadcn Dialouge here instead of button */}
						<Button
							size={"sm"}
							variant={"secondary"}
							onClick={() => openDialog()}
							className="mt-8 h-min w-min px-8 py-4 text-xl font-semibold text-black transition-all duration-200 active:scale-90"
						>
							Start Framing&nbsp;
							<BsArrowRight />
						</Button>
					</div>
					<div className="flex w-full flex-1 justify-center md:justify-end">
						<Image
							src={heroImage.src}
							alt="hero"
							loading="eager"
							placeholder="blur"
							quality={100}
							priority
							blurDataURL={heroImage.blurDataURL}
							className="w-full object-cover max-md:h-[375px] md:max-h-screen"
							width={heroImage.width}
							height={heroImage.height}
						/>
					</div>
				</div>
			</section>
		</>
	);
}

export default Hero;