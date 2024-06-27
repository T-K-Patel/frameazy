import Logo from "../assets/frameasy-logo.png";
import { BsFacebook, BsInstagram, BsTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaEnvelope, FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
    <div className="w-[89%] mx-auto mt-20">
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-5">
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl font-bold">Join our Newsletter</h2>
          <p className="md:text-xl font-light pt-2">
            We’ll send you a nice letter once per week. No spam
          </p>
        </div>
        <div className="flex-1 relative flex w-full">
          <input
            type="text"
            placeholder="Enter your email"
            className="bg-[rgba(0,0,0,0.1)] py-4 px-5 rounded-xl md:text-xl w-full h-10 md:h-full"
          />
          <button className=" absolute right-0 uppercase w-[150px] lg:w-[200px] h-full flex justify-center items-center rounded-xl bg-dark-blue text-white md:text-xl">
            Subscribe
          </button>
        </div>
      </div>
      <div className="flex items-start gap-10 md:items-center justify-between flex-col md:flex-row my-16">
        <div className="flex-1 flex gap-5 flex-col">
          <div className="flex gap-3">
            <FaLocationDot size={24} />
            <p className="md:text-xl">3517 W. Gray St. Utica</p>
          </div>
          <div className="flex gap-3">
            <FaEnvelope size={24} />
            <p className="md:text-xl">Frameazy@mail.co</p>
          </div>
          <div className="flex gap-3">
            <BsTelephoneFill size={24} />
            <p className="md:text-xl">(+33)7 65 55 72 67</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col md:items-end">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Our Social media</h3>
          <div className="flex gap-6">
            <div className="text-white bg-dark-blue p-3 sm:p-4 rounded-md">
              <BsInstagram size={24} />
            </div>
            <div className="text-white bg-dark-blue p-3 sm:p-4 rounded-md">
              <BsFacebook size={24} />
            </div>
            <div className="text-white bg-dark-blue p-3 sm:p-4 rounded-md">
              <BsTwitter size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-[#f1f1f1] border-solid">
        <div className="w-[89%] mx-auto flex flex-col md:flex-row gap-5 justify-start md:justify-between my-9 font-semibold">
            <p>&copy;2023 Copyright by Frameazy</p>
            <img src={Logo} alt="logo" loading="lazy" className="w-[132px]" />
            <p>Terms, Privacy policy</p>
        </div>
    </div>
    </>
  );
};

export default Footer;
