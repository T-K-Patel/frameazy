import Button from "../components/Button";
import ArtImg from "../assets/art_2.png";
// import { Link } from "react-router-dom";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

const EnhanceArt = () => {
  return (
    <div className="my-20 w-[89%] mx-auto flex gap-5 flex-col md:flex-row">
      <div className="flex-1 flex justify-end">
        <img
          src={ArtImg}
          alt="frame"
          loading="lazy"
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-start mb-5 md:mb-0">
        <h2 className="text-4xl font-semibold mb-6 lg:w-[450px]">
          Enhance Your Frames with Stock Images
        </h2>
        <p>
          At Frameazy, we understand that sometimes the perfect artwork can be
          found beyond your personal collection. That's why we've made it easy
          for you to elevate your frames with stunning stock images from
          reputable sources like Shutterstock.
        </p>
        {/* <Button title="Get Framing" /> */}
        <Link
          href="/frames"
          className="bg-white py-4 px-10 text-[#333] text-xl font-semibold rounded-xl mt-8 flex items-center gap-4 border border-solid border-dark-blue hover:bg-dark-blue hover:text-white hover:border-white"
        >
          Get Framing
          <BsArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default EnhanceArt;
