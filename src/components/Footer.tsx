import Logo from "../assets/frameasy-logo.png";
import { BsFacebook, BsInstagram, BsTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaEnvelope, FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <>
      <div className="w-11/12 mx-auto mt-20">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-5">
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-bold">Join our Newsletter</h2>
            <p className="md:text-xl font-light pt-2">
              We’ll send you a nice letter once per week. No spam
            </p>
          </div>
          <form className="flex max-md:w-full w-fit max-xs:flex-col bg-black bg-opacity-[0.1] rounded-xl">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent w-full md:w-fit py-4 px-5 h-12 lg:h-14 outline-none"
            />
            {/* <Button */}
            <Button size={"sm"} className="uppercase p-4 px-8 w-max max-xs:w-full h-12 lg:h-14">
              Subscribe
            </Button>
          </form>
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
              <Button size={"icon"} className="text-white p-3 sm:p-4 rounded-md">
                <BsInstagram size={20} />
              </Button>
              <Button size={"icon"} className="text-white p-3 sm:p-4 rounded-md">
                <BsFacebook size={20} />
              </Button>
              <Button size={"icon"} className="text-white p-3 sm:p-4 rounded-md">
                <BsTwitter size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-[#f1f1f1] border-solid">
        <div className="w-[89%] mx-auto flex flex-col md:flex-row gap-5 justify-start md:justify-between my-9 font-semibold">
          <p>&copy;{new Date().getFullYear()} Copyright by Frameazy</p>
          <Image src={Logo} alt="logo" loading="lazy" className="w-[132px]" />
          <p>Terms, Privacy policy</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
