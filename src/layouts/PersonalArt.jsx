import React from "react";
import PersonalArtItem from "./PersonalArtItem";
import { BsArrowRight } from "react-icons/bs";
import Personal1 from "../assets/personal1.png";
import Personal2 from "../assets/personal2.png";
import Personal3 from "../assets/personal3.png";

const PersonalArt = () => {
  return (
    <section className="text-white bg-dark-blue py-20">
      <div className="w-[89%] mx-auto">
        <div className="text-center max-w-[880px] mx-auto">
          <h2 className="text-4xl mb-5">Personalize your Frame</h2>
          <p>
            At Frameazy, we believe in the beauty of individuality. Your space
            is a canvas, and your frames should be as unique as your style and
            memories. That's why we offer a range of personalization options to
            make your frames truly yours.
          </p>
        </div>
        <div className="flex gap-14 flex-wrap lg:flex-nowrap mt-10 justify-center">
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
        <button className="py-4 px-8 mt-14 mx-auto text-white text-xl font-semibold rounded-xl flex items-center gap-4 border border-solid border-white hover:text-dark-blue hover:bg-white">
          Get Started
          <BsArrowRight />
        </button>
      </div>
    </section>
  );
};

export default PersonalArt;
