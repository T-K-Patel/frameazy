"use server";
import React from "react";
import { Cart } from "./(components)/Cart";
import { getCartItems } from "@/serverActions/cart/cart.actions";

async function CartPage() {
    let cartItems = await getCartItems();
    return (
        <section className="mx-auto my-5 max-w-screen-2xl">
            {cartItems.success ?
                <Cart cartItems={cartItems.data} /> :
                <Cart cartItems={[]} error={"Internal server Error occured"}></Cart>}
        </section>
    );
}

export default CartPage;
