import React from "react";
import { BsArrowRight } from "react-icons/bs";
import Personal1 from "@/assets/personal1.png";
import Personal2 from "@/assets/personal2.png";
import Personal3 from "@/assets/personal3.png";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";

type PersonalArtItemProps = {
    img: StaticImageData;
    title: string;
    desc: string;
};

const PersonalArtItem = ({ img, title, desc }: PersonalArtItemProps) => {
    return (
        <div className="w-[387px] text-black">
            <Image src={img} alt="" className="h-[191px] w-[387px] rounded-t-xl" />
            <div className="rounded-b-xl bg-white px-5 py-5">
                <h2 className="pb-3 text-2xl font-semibold">{title}</h2>
                <p className="font-light">{desc}</p>
            </div>
        </div>
    );
};

const PersonalizeFrame = () => {
    return (
        <section className="bg-blue-1 py-20 text-white">
            <div className="mx-auto w-[89%]">
                <div className="mx-auto max-w-[880px] text-center">
                    <h2 className="mb-5 text-4xl">Personalize your Frame</h2>
                    <p>
                        At Frameazy, we believe in the beauty of individuality. Your space is a canvas, and your frames
                        should be as unique as your style and memories. That&apos;s why we offer a range of
                        personalization options to make your frames truly yours.
                    </p>
                </div>
                <div className="mt-10 flex flex-wrap justify-center gap-14 lg:flex-nowrap">
                    <PersonalArtItem
                        img={Personal1}
                        title="Custom Placement"
                        desc="Our customization tool lets you adjust the placement of frames and artwork on your selected wall. You have the creative freedom to find the perfect arrangement that complements your space."
                    />
                    <PersonalArtItem
                        img={Personal2}
                        title="Add Meaningful Text"
                        desc="Make your frames even more special by adding text. Whether it's a favorite quote, a significant date, or a personal message, our personalization feature allows you to tell your story through your frames."
                    />
                    <PersonalArtItem
                        img={Personal3}
                        title="Choose Matting"
                        desc="Matting can enhance the presentation of your framed art. We provide options for you to select the matting that best complements your artwork and frames. This simple touch can make a world of difference."
                    />
                </div>
                <Button
                    size={"sm"}
                    variant={"light"}
                    className="mx-auto mt-8 h-min w-min border border-white bg-transparent px-8 py-4 text-xl font-semibold text-white transition-all duration-200 active:scale-90"
                >
                    Get Started
                    <BsArrowRight />
                </Button>
            </div>
        </section>
    );
};

export default PersonalizeFrame;
