import Logo from "../../assets/frameasy-logo.png";
import Frame from "../../assets/frame-sign.png";
import { Link} from "next/router"
import { BsArrowLeft } from "react-icons/bs";
import { auth } from "../../firebase-config";

const VerifyEmail = () => {
  const user = auth.currentUser;

  return (
    <div className="flex">
      <div className="my-10 flex-1 mx-5">
        <a href="/" className="md:ml-10 lg:ml-14 xl:ml-20 inline-block">
          <img src={Logo} alt="logo" loading="lazy" />
        </a>
        <div className="max-w-[425px] flex flex-col gap-6 lg:gap-10 mx-auto mt-10 lg:mt-16 ">
          <div className="text-center">
            <h1 className="mb-2 text-2xl md:text-4xl font-semibold">
              Verify your Email
            </h1>
            <p className="text-sm md:text-base">
              To start using Frameazy, Confirm your email address we sent to:
            </p>
            <p className="font-semibold text-xl">{user !== null && user.email}</p>
          </div>
          <form action="" className="flex flex-col gap-4">
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

export default VerifyEmail;
