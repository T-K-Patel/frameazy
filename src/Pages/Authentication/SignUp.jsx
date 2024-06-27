import { useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import Logo from "../../assets/frameasy-logo.png";
import Frame from "../../assets/frame-sign.png";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const SignUp = ({ signInWithGoogle }) => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);
  let navigate = useNavigate();

  const isPasswordConfirmed = (registerPassword, confirmPassword) => {
    if (
      registerPassword &&
      confirmPassword &&
      registerPassword === confirmPassword
    )
      return true;
    return false;
  };

  const register = async (e) => {
    e.preventDefault();
    if (
      registerEmail === "" ||
      registerPassword === "" ||
      confirmPassword === ""
    ) {
      return setError("Fill all fields!");
    } else if (!isPasswordConfirmed(registerPassword, confirmPassword)) {
      return setError("passwords does not match!");
    } else if (registerPassword.length <= 7 || confirmPassword.length <= 7) {
      return setError("Passwords must be greater than 8");
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      // await updateProfile(res.user, {
      //   displayName: registerName,
      // });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        registerEmail,
      });
      sendEmailVerification(auth.currentUser).then(() => {
        console.log("Email verification sent!");
        toast.success("Email verification sent!");
        // ...
      });
      // const resChat = await getDoc(doc(db, "userchats", res.user.uid));
      // if (!resChat.exists()) {
      //   await setDoc(doc(db, "userchats", res.user.uid), {});
      // }
      navigate("/verifyemail");
      // toast.success("Log in successful");
    } catch (err) {
      setError("");
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    } // eslint-disable-next-line
  }, []);

  return (
    <div className="flex">
      <div className="my-10 flex-1 mx-5">
        <a href="/" className="md:ml-10 lg:ml-14 xl:ml-20 inline-block">
          <img src={Logo} alt="logo" loading="lazy" />
        </a>
        <div className="max-w-[425px] flex flex-col gap-6 lg:gap-10 mx-auto mt-10 lg:mt-16 ">
          <div className="text-center">
            <h1 className="mb-2 text-2xl md:text-4xl font-semibold">
              Create an Account
            </h1>
            <p className="text-sm md:text-base">
              Create an Account to get framing
            </p>
          </div>
          <button
            className="flex gap-3 items-center border border-solid border-black rounded-xl justify-center py-4 w-full"
            onClick={signInWithGoogle}
          >
            <FcGoogle size={24} />
            <p className="font-semibold text-xl">Sign up with Google</p>
          </button>
          <div className="flex items-center">
            <div className="bg-[#D2D1D1] h-[1px] w-full" />
            <p className="font-semibold text-xl px-4">or</p>
            <div className="bg-[#D2D1D1] h-[1px] w-full" />
          </div>
          <form onSubmit={register} className="flex flex-col gap-4">
            <Input
              title={"Email"}
              type={"email"}
              placeholder={"email@mail.com"}
              name={"email"}
              onChange={(event) => {
                setRegisterEmail(event.target.value);
              }}
              error={error}
            />
            <Input
              title={"Password"}
              type={"password"}
              placeholder={"Min. 8 chararcters"}
              name={"password"}
              onChange={(event) => {
                setRegisterPassword(event.target.value);
              }}
              error={error}
            />
            <Input
              title={"Confirm Password"}
              type={"password"}
              placeholder={"Min. 8 chararcters"}
              name={"confirm_password"}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              error={error}
            />
            <p className="text-red-500 text-sm">{error}</p>
            <button
              type="submit"
              className="font-semibold text-xl text-white bg-dark-blue rounded-xl justify-center py-4 w-full mt-6"
            >
              Sign Up
            </button>
            <p className="text-sm">
              Already have an account?
              <Link href="/login" className="text-dark-blue font-semibold pl-2">
                Sign in
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

export default SignUp;
