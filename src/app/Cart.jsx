import React from "react";
import Frame from "../assets/frame-1.png";
import { IoIosClose } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import Input from "../components/Input";

const CartItem = ({ item, onAdd, onRemove }) => {
  return (
    <div className="border border-solid border-[#f1f1f1] rounded-xl p-5 h-[120px] flex justify-between items-center">
      <div className="flex gap-8 items-center">
        <img
          src={item.productImage}
          alt="frame"
          className="w-[100px] h-20 object-contain"
        />
        <p className="text-2xl font-semibold">{item.productName}</p>
      </div>
      <div className="flex gap-8 items-center">
        <div className="bg-dark-blue text-white rounded-lg flex justify-between items-center gap-7 p-2">
          <FaMinus
            size={24}
            onClick={() => {
              onRemove(item);
            }}
          />
          <p className="text-2xl">{item.qty}</p>
          <FaPlus
            size={24}
            onClick={() => {
              onAdd(item);
            }}
          />
        </div>
        <p className="text-2xl font-semibold">
          ${item.productPrice * item.qty}
        </p>
        <IoIosClose size={40} />
      </div>
    </div>
  );
};

const Cart = ({ cartItems, onAdd, onRemove }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 w-[89%] mx-auto">
      <div className="flex-1 border border-solid border-[#f1f1f1] rounded-2xl pb-14 px-8">
        <div className="py-10">
          <h2 className="text-3xl font-semibold mb-5">My Cart</h2>
          <div className="w-full h-[1px] bg-[#f1f1f1]" />
        </div>
        {cartItems.length === 0 && (
          <p className="text-center text-2xl font-semi-bold">
            Your cart is empty!
          </p>
        )}
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
        <button className="font-semibold mt-10 px-6 py-4 text-xl">
          Cancel Orders
        </button>
      </div>
      <div className="w-[425px]">
        <h1 className="text-3xl font-semibold mb-2">Payment Details</h1>
        <p>
          Complete your purchase item by providing your payment details order.
        </p>
        <form action="" className="mt-5">
          <Input
            title={"Name on card"}
            type={"text"}
            placeholder={"Jane Doe"}
            name={"name on card"}
            //   onChange={(event) => {
            //     setRegisterEmail(event.target.value);
            //   }}
            //   error={error}
          />
        </form>
      </div>
    </div>
  );
};

export default Cart;
