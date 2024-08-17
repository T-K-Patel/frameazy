import Image from "next/image";
import React from "react";
import heroImage from "@/assets/hero_img.png";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import { Button } from "@/components/ui/button";
import { useFrames } from "@/context/frames-context";
import { BsArrowRight } from "react-icons/bs";

function Hero() {
    const { setDialogOpen } = useFrames();
    return (
        <>
            <section className="bg-blue-1">
                <div className="mx-auto flex h-full max-w-screen-2xl flex-col gap-5 overflow-hidden md:max-h-screen md:flex-row">
                    <div className="mx-5 my-10 flex flex-1 flex-col items-start justify-center text-white sm:mx-10 md:mx-0 md:my-0 md:ml-14 lg:ml-20">
                        <h1 className="pb-5 text-4xl font-bold lg:text-6xl">Design Your Dream Frames with Frameasy</h1>
                        <p>
                            Frameazy Where Your Imagination Meets Our Craftsmanship. Our Passion is Crafting Beautiful
                            Frames, Personalized Just for You. Explore Endless Possibilities
                        </p>
                        <Button
                            size={"sm"}
                            variant={"secondary"}
                            onClick={() => setDialogOpen(true)}
                            className="mt-8 h-min w-min px-8 py-4 text-xl font-semibold text-black transition-all duration-200 active:scale-90"
                        >
                            Start Framing&nbsp;
                            <BsArrowRight />
                        </Button>
                    </div>
                    <div className="flex w-full flex-1 justify-center md:justify-end">
                        <Image
                            src={heroImage}
                            placeholder="blur"
                            blurDataURL={getImagePlaceholder(heroImage.width, heroImage.height)}
                            alt="hero"
                            loading="lazy"
                            className="w-full object-cover max-md:h-[375px] md:max-h-screen"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Hero;
