import Logo from "../assets/frameasy-logo.png";
import { BsFacebook, BsInstagram, BsTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaEnvelope, FaLocationDot } from "react-icons/fa6";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

const Footer = () => {
  return (
    <>
    <div className="w-[375px] h-auto pl-10 pr-5 pt-10 pb-10 md:pb-0 flex flex-col gap-y-16 text-black md:w-[1440px] md:h-auto md:pl-20 md:pr-10">
      <div className="w-[335px] h-[132px] flex flex-col items-center justify-between md:w-[1280px] md:h-[107px] md:flex-row">
        <div className="w-[333px] h-[80px] flex flex-col gap-y-2 md:w-auto md:h-[107px]">
          <div className="w-[202px] h-[30px] font-bold text-xl leading-[30px] md:w-[345px] md:h-[66px] md:text-3xl md:leading-[66px]">
            Join our Newsletter
          </div>
          <div className="w-full h-[42px] text-sm leading-[21px] text-black-1 md:text-xl md:leading-[33px] md:h-[33px]">
            We’ll send you a nice letter once per week. No spam
          </div>
        </div>
        <div className="w-[335px] h-[32px] flex overflow-hidden md:w-[542px] md:h-[52px] md:pl-25">
          <Input className="w-[60%] h-full rounded-[7.42px] overflow-hidden bg-gray-1 text-black" type="text" placeholder="Enter your email"/>
          <Button className="h-full" size={"smm"}>Subscribe</Button>
        </div>
      </div>
      <div className="w-[335px] h-[258px] flex flex-col justify-between md:w-[1280px] md:h-[139px] md:flex-row">
        <div className="w-[183px] h-[112px] flex flex-col gap-y-5 md:w-[214px] md:h-[139px]">
            <div className="w-[183px] h-[24px] flex gap-x-3">
                <FaLocationDot className="w-6 h-6 overflow-hidden"/>
                <div className="pt-1 w-[147px] h-[21px] text-sm leading-[21px] text-black">
                3517 W. Gray St. Utica
                </div>
            </div>
            <div className="w-[170px] h-[24px] flex gap-x-3">
                <FaEnvelope className="w-6 h-6 overflow-hidden"/>
                <div className="w-[134px] h-[21px] text-sm leading-[21px] text-black">
                Frameazy@mail.co
                </div>
            </div>
            <div className="w-[165px] h-6 flex gap-x-3">
                <BsTelephoneFill className="w-6 h-6 overflow-hidden"/>
                <div className="w-[129px] h-[21px] text-sm leading-[21px] text-black">
                (+33)7 65 55 72 67
                </div>
            </div>
        </div>
        <div className="w-[228px] h-[106px] flex flex-col gap-y-4 md:w-[228px] md:h-[116px] ">
            <div className="w-[175px] h-[30px] font-bold text-xl leading-[30px] text-black">
            Our social media
            </div>
            <div className="w-[228px] h-[60px] flex gap-x-6">
                <div className="text-white bg-blue-1 p-3 sm:p-4 rounded-[6px] overflow-hidden">
                <BsInstagram size={24} />
                </div>
                <div className="text-white bg-blue-1 p-3 sm:p-4 rounded-md">
                <BsFacebook size={24} />
                </div>
                <div className="text-white bg-blue-1 p-3 sm:p-4 rounded-md">
                <BsTwitter size={24} />
                </div>
            </div>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-[#f1f1f1] border-solid md:w-[1440px] md:h-[96px]">
    <div className="w-[89%] mx-auto flex flex-col md:flex-row gap-5 justify-start md:justify-between my-9 font-semibold">
        <p>&copy;2023 Copyright by Frameazy</p>
        <Image src={Logo} alt="logo" loading="lazy" className="w-[132px]" />
        <p>Terms, Privacy policy</p>
    </div>
   </div>
</>
  );
};

export default Footer;
