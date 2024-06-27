import React from "react";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";

const Accordion = (props) => {
  return (
    <div className="my-4 border-b-2 border-b-[#f1f1f1]">
      <button
        className="mb-4 w-full text-left transition duration-300 flex justify-between"
        onClick={props.toggleAccordion}
      >
        <p className="md:text-xl font-medium">{props.title}</p>

        {props.isOpen ? (
          <span
            className={`float-right transform ${
              props.isOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300`}
          >
            <BiMinus size={24} />
          </span>
        ) : (
          <span
            className={`float-right transform ${
              props.isOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300`}
          >
            <BsPlus size={24} />
          </span>
        )}
      </button>
      {props.isOpen && <div className="mb-4">{props.data}</div>}
    </div>
  );
};

export default Accordion;
