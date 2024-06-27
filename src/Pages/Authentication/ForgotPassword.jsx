import Logo from "../../assets/frameasy-logo.png";
import Frame from "../../assets/frame-sign.png";
import { Link} from "next/router"
import { BsArrowLeft } from "react-icons/bs";

const ForgotPassword = () => {
  return (
    <div className="flex">
      <div className="my-10 flex-1 mx-5">
        <a href="/" className="md:ml-10 lg:ml-14 xl:ml-20 inline-block">
          <img src={Logo} alt="logo" loading="lazy" />
        </a>
        <div className="max-w-[425px] flex flex-col gap-6 lg:gap-10 mx-auto mt-10 lg:mt-16 ">
          <div className="text-center">
            <h1 className="mb-2 text-2xl md:text-4xl font-semibold">
              Forgot Password?
            </h1>
            <p className="text-sm md:text-base">
              No worries, we’ll send you reset instructions
            </p>
          </div>
          <form action="" className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="font-semibold lg:text-xl pb-2">Email</span>
              <input
                type="email"
                placeholder="email@mail.com"
                name="email"
                className="border border-solid border-[#D2D1D1] rounded-xl h-[60px] px-5 py-4"
              />
            </label>
            <button className="font-semibold text-xl text-white bg-dark-blue rounded-xl justify-center py-4 w-full my-6">
              Reset Password
            </button>
            <Link
              href="/login"
              className="font-semibold pl-2 text-center flex gap-3 justify-center items-center"
            >
            <BsArrowLeft size={24} />
              Back to Sign in
            </Link>
          </form>
        </div>
      </div>
      <div className="flex-1 h-full lg:block hidden">
        <img
          src={Frame}
          alt="frame"
          loading="lazy"
          className="h-screen object-cover w-full"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
