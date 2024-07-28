import ArtImg from "@/assets/art_2.png";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getImagePlaceholder } from "@/components/imagePlaceholder";

const EnhanceArt = () => {
    return (
        <div className="mx-auto my-20 flex w-11/12 max-w-screen-2xl flex-col gap-5 md:flex-row">
            <div className="flex flex-1 justify-end">
                <Image
                    src={ArtImg}
                    alt="frame"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={getImagePlaceholder(ArtImg.width, ArtImg.height)}
                    className="rounded-xl object-cover"
                />
            </div>
            <div className="mb-5 flex flex-1 flex-col items-start justify-center md:mb-0">
                <h2 className="mb-6 text-4xl font-semibold lg:w-[450px]">Enhance Your Frames with Stock Images</h2>
                <p>
                    At Frameazy, we understand that sometimes the perfect artwork can be found beyond your personal
                    collection. That&apos;s why we&apos;ve made it easy for you to elevate your frames with stunning
                    stock images from reputable sources like Shutterstock.
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
