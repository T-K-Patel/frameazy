import { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { BsCart3 } from "react-icons/bs";

const Sidebar = ({ toggle, links, signUserOut, showSideBar }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div
      className={`fixed right-[-100%] top-0 w-48 bg-white h-screen md:hidden text-right px-5 ease-in-out duration-300 shadow-xl z-30 ${
        showSideBar && "right-[0]"
      }`}
    >
      <FaTimes
        size={24}
        onClick={toggle}
        className="cursor-pointer mt-8 mb-16 text-right inline-block"
      />
      <ul className="flex flex-col gap-5">
        {links.map((link) => (
          <li
            key={link.id}
            className={"font-bold text-dark-blue text-[#00000084]"
            }
            onClick={toggle}
          >
            <Link href={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
      {!currentUser && (
        <div className="flex flex-col items-center gap-5 text-dark-blue font-bold justify-end h-[300px]">
          <Link href="login" className="hover:underline">
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
        <div className="flex flex-col gap-5 items-center justify-end h-[300px]">
          <Link href="/cart"  className="flex gap-3 items-center text-dark-blue">
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
    </div>
  );
};

export default Sidebar;
