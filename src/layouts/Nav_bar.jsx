import { useState, useContext } from "react";
import Logo from "../assets/frameasy-logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { BsCart3 } from "react-icons/bs";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const Navbar = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  // const { currentUser } = useContext(AuthContext);
  const currentUser = null;
  const location = {pathname: '/'}

  const toggleSidebar = () => {
    showSideBar === true ? setShowSideBar(false) : setShowSideBar(true);
  };

  const signUserOut = () => {
    signOut(auth).then(() => {
      //  handleClose();
      redirect("/login");
      toast.success("Logged out sucessfully");
    });
  };

  const links = [
    {
      id: "1",
      name: "Home",
      path: "/",
    },
    {
      id: "2",
      name: "Frames",
      path: "/frames",
    },
    {
      id: "3",
      name: "Contacts",
      path: "/contact",
    },
  ];

  return (
    <>
      <nav className="flex justify-between items-center w-[89%] mx-auto h-[100px]">
        <a href="/">
          <img src={Logo} alt="logo" loading="lazy" />
        </a>
        <ul className="md:flex gap-5 hidden">
          {links.map((link) => (
            <li
              key={link.id}
              className={
                location.pathname === link.path
                  ? "font-bold text-dark-blue"
                  : "text-[#00000084] hover:text-black"
              }
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
        {!currentUser && (
          <div className="md:flex hidden items-center gap-5 text-dark-blue font-bold">
            <Link href="/login" className="hover:underline">
              Log in
            </Link>
            <Link
              href="/signup"
              className="border border-solid border-dark-blue px-5 py-3 rounded-xl hover:text-white hover:bg-dark-blue"
            >
              Get Started
            </Link>
          </div>
        )}
        {currentUser && (
          <div className="hidden md:flex gap-5 items-center">
            <Link href="/cart" className="flex gap-3 items-center text-dark-blue">
              <BsCart3 size={30} />
              <p className=" text-xl font-semibold">Cart</p>
            </Link>
            <button
              onClick={signUserOut}
              className="py-2 px-4 bg-dark-blue text-white w-full justify-center rounded-lg"
            >
              Sign out
            </button>
          </div>
        )}
        <div
          className="flex md:hidden cursor-pointer"
          onClick={() => {
            setShowSideBar(!showSideBar);
          }}
        >
          <RxHamburgerMenu size="24px" />
        </div>
      </nav>
      <Sidebar
        toggle={toggleSidebar}
        showSideBar={showSideBar}
        links={links}
        signUserOut={signUserOut}
      />
    </>
  );
};

export default Navbar;
