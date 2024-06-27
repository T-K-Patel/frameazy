import React from "react";
import FrameCategory from "../components/FrameCategory";
import Collections from "../components/Collections";
import CustomSizes from "../components/CustomSizes";
import PopularSizes from "../components/PopularSizes";
import FrameColor from "../components/FrameColor";
import { FaTimes } from "react-icons/fa";

const FrameSidebar = ({ toggle, showFrameSidebar }) => {
  return (
    <>
      {showFrameSidebar && (
        <div className="fixed right-0 top-0 w-full h-full bg-black opacity-50" />
      )}
      <div
        className={`fixed overflow-y-scroll right-[-100%] top-0 w-80 bg-white h-full lg:hidden px-5 ease-in-out duration-300 shadow-xl z-30 py-8 ${
          showFrameSidebar && "right-[0]"
        }`}
      >
        <FaTimes
          size={24}
          onClick={toggle}
          className="cursor-pointer mb-8 text-right inline-block"
        />
        <div className="flex flex-col gap-[40px]">
          <FrameCategory />
          <Collections />
          <CustomSizes />
          <PopularSizes />
          <FrameColor />
        </div>
      </div>
    </>
  );
};

export default FrameSidebar;
