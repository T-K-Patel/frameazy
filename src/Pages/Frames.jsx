import React, { useState } from "react";
import FrameCategory from "../components/FrameCategory";
import Collections from "../components/Collections";
import PopularSizes from "../components/PopularSizes";
import FrameColor from "../components/FrameColor";
import CustomSizes from "../components/CustomSizes";
import { BsCart3 } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowSwitch } from "react-icons/go";
import FrameSidebar from "../layouts/FrameSidebar";
import { toast } from "react-toastify";

const FrameItem = ({ frame, onAdd }) => {
  const addToCart = () => {
    onAdd(frame);
    toast.success("Product added to cart");
  };
  return (
    <div className="px-3 py-4 border border-solid rounded-lg w-[280px] border-[#f1f1f1] flex flex-col gap-5">
      <div className="w-[65%] mx-auto">
        <img src={frame.productImage} alt="frame" />
      </div>
      <div>
        <p className="mb-1">{frame.productName}</p>
        <p className="text-sm">${frame.productPrice}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={addToCart}
          className="flex gap-2 items-center py-3 bg-dark-blue text-white w-full justify-center rounded-lg"
        >
          <BsCart3 size={16} />
          Add to cart
        </button>
        <Link
          href={`/frames/${frame.id}`}
          state={{ id: frame.id }}
          className="py-3 px-5 text-dark-blue border border-solid rounded-lg border-dark-blue hover:bg-dark-blue hover:text-white"
        >
          <AiFillEdit size={24} />
        </Link>
      </div>
    </div>
  );
};

const Frames = ({ frames, onAdd }) => {
  // let navigate = useNavigate();
  const [showFrameSidebar, setShowFrameSidebar] = useState(false);

  const toggleSidebar = () => {
    showFrameSidebar === true
      ? setShowFrameSidebar(false)
      : setShowFrameSidebar(true);
  };

  return (
    <>
      <div className="flex w-[90%] mx-auto">
        <div className="hidden w-1/4 pt-14 border-r border-solid lg:flex flex-col gap-[60px] pr-4">
          <FrameCategory />
          <Collections />
          <CustomSizes />
          <PopularSizes />
          <FrameColor />
        </div>
        <div className="w-full lg:w-3/4 lg:ml-10">
          <div className="flex justify-between items-center pb-12">
            <h1 className="text-4xl font-semibold">Frames</h1>
            <p
              className="lg:hidden flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setShowFrameSidebar(!showFrameSidebar);
              }}
            >
              Categories
              <GoArrowSwitch />
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {frames.map((frame) => {
              return <FrameItem frame={frame} key={frame.id} onAdd={onAdd} />;
            })}
          </div>
        </div>
      </div>
      {/* {showFrameSidebar && ( */}
      <FrameSidebar
        toggle={toggleSidebar}
        showFrameSidebar={showFrameSidebar}
        // links={links}
        // signUserOut={signUserOut}
      />
      {/* )} */}
    </>
  );
};

export default Frames;
