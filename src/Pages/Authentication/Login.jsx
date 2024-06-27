import { useState, useEffect, useContext } from "react";
import Logo from "../../assets/frameasy-logo.png";
import Frame from "../../assets/frame-sign.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = ({ signInWithGoogle }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // const [showPassword, setShowPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);
  let navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (loginEmail === "" || loginPassword === "") {
      return setError("Fill all fields!");
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // console.log(user);
      navigate("/");
      toast.success("Log in successful");
    } catch (error) {
      console.log(error.message);
      setError("");
    }
  };

  // useEffect(() => {
  //   if (currentUser) {
  //     navigate("/");
  //   } // eslint-disable-next-line
  // }, []);

  return (
    <div className="flex">
      <div className="my-10 flex-1 mx-5">
        <a href="/" className="md:ml-10 lg:ml-14 xl:ml-20 inline-block">
          <img src={Logo} alt="logo" loading="lazy" />
        </a>
        <div className="max-w-[425px] flex flex-col gap-6 lg:gap-10 mx-auto mt-10 lg:mt-16 ">
          <div className="text-center">
            <h1 className="mb-2 text-2xl md:text-4xl font-semibold">
              Welcome Back!
            </h1>
            <p className="text-sm md:text-base">
              Please enter your credentials to access your account
            </p>
          </div>
          <button
            className="flex gap-3 items-center border border-solid border-black rounded-xl justify-center py-4 w-full"
            onClick={signInWithGoogle}
          >
            <FcGoogle size={24} />
            <p className="font-semibold text-xl">Sign in with Google</p>
          </button>
          <div className="flex items-center">
            <div className="bg-[#D2D1D1] h-[1px] w-full" />
            <p className="font-semibold text-xl px-4">or</p>
            <div className="bg-[#D2D1D1] h-[1px] w-full" />
          </div>
          <form onSubmit={login} className="flex flex-col gap-4">
            <Input
              title={"Email"}
              type={"email"}
              placeholder={"email@mail.com"}
              name={"email"}
              onChange={(event) => {
                setLoginEmail(event.target.value);
              }}
              error={error}
            />
            <Input
              title={"Password"}
              type={"password"}
              placeholder={"Min. 8 chararcters"}
              name={"password"}
              onChange={(event) => {
                setLoginPassword(event.target.value);
              }}
              error={error}
            />
            <p className="text-red-500 text-sm">{error}</p>
            <Link href="/forgotpassword" className="text-sm font-semibold">
              Forgot Password?
            </Link>
            <button className="font-semibold text-xl text-white bg-dark-blue rounded-xl justify-center py-4 w-full mt-6">
              Sign Up
            </button>
            <p className="text-sm">
              New User?
              <Link href="/signup" className="text-dark-blue font-semibold pl-2">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div className="flex-1 h-full lg:block hidden">
        <img
          src={Frame}
          alt="frame"
          loading="lazy"
          className="h-[900px] object-cover w-full"
        />
      </div>
    </div>
  );
};

export default Login;
