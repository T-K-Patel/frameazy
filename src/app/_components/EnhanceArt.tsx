"use client";
import ArtImg from "@/assets/art_2.png";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const EnhanceArt = () => {
	return (
		<div className="mx-auto my-20 flex w-11/12 max-w-screen-2xl flex-col gap-5 md:flex-row">
			<div className="flex flex-1 justify-end">
				<Image
					src={ArtImg.src}
					alt="frame"
					loading="eager"
					width={ArtImg.width}
					height={ArtImg.height}
					quality={100}
					priority
					blurDataURL={ArtImg.blurDataURL}
					placeholder="blur"
					// loader={<Img src={getImagePlaceholder(ArtImg.width, ArtImg.height)} />}
					className="rounded-xl object-cover"
				/>
			</div>
			<div className="mb-5 flex flex-1 flex-col items-start justify-center md:mb-0">
				<h2 className="mb-6 text-4xl font-semibold lg:w-[450px]">Why Choose us </h2>
				<p>
					<b>Quality</b>: We use only the finest materials to ensure that every frame is both stylish and
					durable.
				</p>
				<p>
					<b>Customization</b>: Enjoy a personalized framing experience with a wide range of options to suit
					your taste.
				</p>
				<p>
					<b>Convenience</b>: From selection to delivery, we handle every step with care to make your
					experience seamless.
				</p>
				{/* <Button title="Get Framing" /> */}
				<Link href="/frames">
					<Button
						size={"sm"}
						variant={"outline"}
						className="mt-8 h-min w-min border border-black bg-transparent px-8 py-4 text-xl font-semibold text-black transition-all duration-200 active:scale-90"
					>
						Get Framing&nbsp;
						<BsArrowRight />
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default EnhanceArt;
