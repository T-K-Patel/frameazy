import React from "react";

const PersonalArtItem = ({ img, title, desc }) => {
  return (
    <div className="text-black w-[387px]">
      <img src={img} alt="" className="rounded-t-xl w-[387px] h-[191px] " />
      <div className="px-5 py-5 bg-white rounded-b-xl">
        <h2 className="font-semibold text-2xl pb-3">{title}</h2>
        <p className="font-light">{desc}</p>
      </div>
    </div>
  );
};

export default PersonalArtItem;
