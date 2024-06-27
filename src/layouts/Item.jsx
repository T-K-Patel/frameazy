import React from "react";
import Frame from "../assets/frame-1.png";
import { BsCart3 } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

const Item = () => {
  return (
    <div className="p-3 border border-solid w-[350px] rounded-2xl">
      <div className="flex justify-center items-center">
        <img src={Frame} alt="frame" />
      </div>
      <h2 className="text-2xl mt-5">Name</h2>
      <p className="mb-8">Price</p>
      <div className="flex gap-5">
        <button className="flex gap-3 items-center py-4 bg-dark-blue text-white w-full justify-center text-xl rounded-lg">
          <BsCart3 />
          Add to cart
        </button>
        <button className="py-4 px-7 text-dark-blue border border-solid rounded-lg border-dark-blue hover:bg-dark-blue hover:text-white">
          <AiFillEdit size={24} />
        </button>
      </div>
    </div>
  );
};

export default Item;
