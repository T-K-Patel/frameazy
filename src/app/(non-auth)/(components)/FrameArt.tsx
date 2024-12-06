"use client";
import ArtImg from "@/assets/art_1.png";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BsArrowRight } from "react-icons/bs";
import { Img } from "react-image";

const FrameArt = () => {
    return (
        <div className="mx-auto my-20 flex w-11/12 max-w-screen-2xl flex-col gap-5 md:flex-row">
            <div className="mb-5 flex flex-1 flex-col items-start justify-center md:mb-0">
                <h2 className="mb-6 text-4xl font-semibold lg:w-[450px]">The Art of Framing with Frameazy</h2>
                <p>
                    At Frameazy, we&apos;re passionate about the art of framing. We believe that a beautifully crafted
                    frame is not just a border for your artwork; it&apos;s an essential piece of the artwork itself.
                    Each frame we create is a testament to our commitment to artistry and craftsmanship.
                </p>
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
            <div className="flex flex-1 justify-end">
                <Img
                    src={ArtImg.src}
                    alt="frame"
                    loader={<Img src={getImagePlaceholder(ArtImg.width, ArtImg.height)} />}
                    loading="lazy"
                    className="rounded-xl object-cover"
                />
            </div>
        </div>
    );
};

export default FrameArt;
