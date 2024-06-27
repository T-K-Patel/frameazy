import React from "react";

const CustomSizeAdmin = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Custom Sizes</h2>
      <form className="flex flex-col gap-5">
        <label className="flex gap-5 items-center">
          <span className="">Width:</span>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              // placeholder={placeholder}
              name="width"
              // onChange={onChange}
              className=" remove-arrow border border-solid border-[#D2D1D1] rounded-lg h-[30px] px-3 py-1 w-[52px]"
            />
            <span className="">in</span>
          </div>
        </label>
        <label className="flex gap-5 items-center">
          <span className="">Height:</span>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              // placeholder={placeholder}
              name="width"
              // onChange={onChange}
              className="remove-arrow border border-solid border-[#D2D1D1] rounded-lg h-[30px] px-3 py-1 w-[52px]"
            />
            <span className="">in</span>
          </div>
        </label>
      </form>
    </div>
  );
};

export default CustomSizeAdmin;
