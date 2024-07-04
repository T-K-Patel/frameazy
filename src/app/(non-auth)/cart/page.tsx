"use server";
import React from "react";
import { Cart } from "./(components)/Cart";
import { CartItemType } from "./(components)/CartItem";

async function CartPage() {
    // Simulate data fetching from server functions
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const cartItems = await fetch("https://6603bf872393662c31cf89fb.mockapi.io/api/v1/cart", { cache: "no-cache" }).then((res) => res.json() as Promise<CartItemType['item'][]>);
    console.log(cartItems);
    return (
        <section className="my-5 max-w-screen-2xl mx-auto">
            <Cart cartItems={cartItems} />
        </section>
    );
}

export default CartPage;
