import Logo from "../assets/frameasy-logo.png";
import { BsFacebook, BsInstagram, BsTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaEnvelope, FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { Button } from "./ui/button";

const Footer = () => {
    return (
        <>
            <div className="mx-auto mt-20 w-11/12">
                <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold md:text-4xl">Join our Newsletter</h2>
                        <p className="pt-2 font-light md:text-xl">
                            We’ll send you a nice letter once per week. No spam
                        </p>
                    </div>
                    <form className="flex w-fit rounded-xl bg-black bg-opacity-[0.1] max-md:w-full max-xs:flex-col">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="h-12 w-full bg-transparent px-5 py-4 outline-none md:w-fit lg:h-14"
                        />
                        {/* <Button */}
                        <Button size={"sm"} className="h-12 w-max p-4 px-8 uppercase max-xs:w-full lg:h-14">
                            Subscribe
                        </Button>
                    </form>
                </div>
                <div className="my-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
                    <div className="flex flex-1 flex-col gap-5">
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
                    <div className="flex flex-1 flex-col md:items-end">
                        <h3 className="mb-4 text-xl font-bold md:text-2xl">Our Social media</h3>
                        <div className="flex gap-6">
                            <Button size={"icon"} className="rounded-md p-3 text-white sm:p-4">
                                <BsInstagram size={20} />
                            </Button>
                            <Button size={"icon"} className="rounded-md p-3 text-white sm:p-4">
                                <BsFacebook size={20} />
                            </Button>
                            <Button size={"icon"} className="rounded-md p-3 text-white sm:p-4">
                                <BsTwitter size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-2 border-solid border-[#f1f1f1]">
                <div className="mx-auto my-9 flex w-[89%] flex-col justify-start gap-5 font-semibold md:flex-row md:justify-between">
                    <p>&copy;{new Date().getFullYear()} Copyright by Frameazy</p>
                    <Image src={Logo} alt="logo" loading="lazy" className="w-[132px]" />
                    <p>Terms, Privacy policy</p>
                </div>
            </div>
        </>
    );
};

export default Footer;
