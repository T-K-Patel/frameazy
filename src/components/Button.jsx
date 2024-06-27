import { BsArrowRight } from "react-icons/bs";

const Button = ({ title }) => {
  return (
    <button
      className="bg-white py-4 px-10 text-[#333] text-xl font-semibold rounded-xl mt-8 flex items-center gap-4 border border-solid border-dark-blue hover:bg-dark-blue hover:text-white hover:border-white"
    >
      {title}
      <BsArrowRight />
    </button>
  );
};

export default Button;
