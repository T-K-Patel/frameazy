import React from "react";

const Input = ({ type, placeholder, name, onChange, title, error }) => {
  return (
    <label className="flex flex-col">
      <span className="font-semibold lg:text-xl pb-2">{title}</span>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        className={`remove-arrow border border-solid border-[#D2D1D1] rounded-xl h-[60px] px-5 py-4 focus:outline-none ${
          error ? "border-red-500" : ""
        }`}
      />
    </label>
  );
};

export default Input;
