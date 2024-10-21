"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CartItem } from "./(components)/CartItem";
import { Button } from "@/components/ui/button";
import RazorpayLogo from "@/assets/Razorpay_logo.svg";
import { useSession } from "next-auth/react";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import { CartItemType, clearCartAction, getCartItems } from "@/serverActions/cart/cart.actions";
import { placeOrderAction } from "@/serverActions/orders/orders.action";
import { useFormState, useFormStatus } from "react-dom";
import LoadingCart from "./(components)/LoadingCart";
import { useRouter } from "next/navigation";
import { getDeliveryCharge } from "@/utils/totalPrice";
import { Img } from "react-image";

const ClearCartButton = ({ disabled }: { disabled: boolean }) => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} disabled={pending || disabled} variant={"destructive"} className="text-lg font-semibold">
            {pending ? "Clearing" : "Clear Cart"}
        </Button>
    );
};

const PlaceOrderButton = ({ disabled }: { disabled?: boolean }) => {
    const { pending } = useFormStatus();
    return (
        <Button size={"lg"} disabled={pending || disabled} className="h-aut w-full py-3 text-lg">
            {pending ? "Processing" : "Place order"}
        </Button>
    );
};

function Cart() {
    const [cartItems, setCartItems] = useState([] as CartItemType[]);
    const session = useSession();
    const [error, setError] = useState(null as string | null);
    const [loading, setLoading] = useState(true);
    const [clearCartState, clearCart] = useFormState(clearCartAction, null);
    const [showDialog, setShowDialog] = useState(false);
    const [placeOrderState, placeOrder] = useFormState(placeOrderAction, null);
    const addressFormRef = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const fetchCartItems = useCallback(() => {
        setLoading(true);
        getCartItems()
            .then((res) => {
                console.log(res);
                if (res.success) {
                    setCartItems(res.data);
                    setError(null);
                } else {
                    setCartItems([]);
                    setError(res.error);
                }
            })
            .catch(() => {
                setError("An error occurred while fetching cart items");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    // LATER: Implement feature to fetch cart on pooling basis.

    const updateCartItemQty = useCallback(
        (quantity: number, itemId: string) => {
            const updatedData = cartItems.map((item) => {
                if (item.id === itemId) {
                    item.quantity = quantity;
                }
                return item;
            });
            setCartItems(updatedData);
        },
        [cartItems],
    );

    const deleteItem = useCallback(
        (itemId: string) => {
            const updatedData = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedData);
        },
        [cartItems],
    );

    useEffect(() => {
        if (clearCartState?.success) {
            setCartItems([]);
        }
    }, [clearCartState]);

    useEffect(() => {
        if (placeOrderState?.success) {
            setCartItems([]);
            addressFormRef.current?.reset();
            setShowDialog(true);
        }
        if (placeOrderState?.success == false) {
            console.log(placeOrderState);
            alert(placeOrderState.error);
        }
    }, [placeOrderState]);

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", showDialog);
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [showDialog]);

    if (!session?.data?.user?.id) {
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
        return <></>;
    }
    if (loading) {
        return <LoadingCart />;
    }

    const orderTotal = cartItems.reduce((acc, item) => acc + item.quantity * (item.single_unit_price || 0), 0);
    const deliveryCharge = getDeliveryCharge(orderTotal);

    return (
        <section className="mx-auto my-5 max-w-screen-2xl">
            <div className="m-0 mx-auto grid w-11/12 max-w-full gap-6 p-0 lg:grid-cols-3">
                <div className="w-full rounded-2xl border border-solid border-[#f1f1f1] px-4 pb-14 lg:col-span-2">
                    <div className="py-10">
                        <h2 className="mb-5 text-3xl font-semibold">
                            {session?.data?.user.name ? session.data.user.name + "'s" : "My"} Cart
                        </h2>
                        <div className="h-[1px] w-full bg-[#f1f1f1]" />
                    </div>
                    {error ? (
                        <p className="text-center text-2xl font-semibold text-red-500">{error}</p>
                    ) : (
                        cartItems.length === 0 && (
                            <p className="text-center text-2xl font-semibold">Your cart is empty!</p>
                        )
                    )}
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                updateState={updateCartItemQty}
                                deleteItem={deleteItem}
                                fetchCartItems={fetchCartItems}
                            />
                        ))}
                    </div>
                    <form action={clearCart} className="me-4 mt-10 flex flex-col items-end justify-end">
                        {clearCartState?.success == false && (
                            <p className="mb-3 font-semibold text-red-500">{clearCartState.error}</p>
                        )}
                        <ClearCartButton disabled={cartItems.length == 0} />
                    </form>
                </div>
                <div className="w-full">
                    <h1 className="mb-2 text-3xl font-semibold">Order Details</h1>
                    <p>Complete your purchase item by providing details.</p>
                    <form action={placeOrder} ref={addressFormRef} className="mt-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <h1 className="mb-3 text-xl font-semibold">Shipping Address</h1>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Receiptant Name</span>
                                <input
                                    type={"text"}
                                    placeholder={"John Doe"}
                                    name={"name"}
                                    required
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Address Line 1</span>
                                <input
                                    type={"text"}
                                    placeholder={"123 Main St"}
                                    required
                                    name={"address-line-1"}
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="pb-2 font-semibold lg:text-lg">Address line 2</span>
                                <input
                                    type={"text"}
                                    placeholder={"123 Main St"}
                                    required
                                    name={"address-line-2"}
                                    className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">City</span>
                                    <input
                                        type={"text"}
                                        placeholder={"New York"}
                                        required
                                        name={"city"}
                                        className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">Pin Code</span>
                                    <input
                                        type={"text"}
                                        placeholder={"100001"}
                                        required
                                        pattern="[0-9]{6}"
                                        name={"pin-code"}
                                        className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">State</span>
                                    <input
                                        type={"text"}
                                        placeholder={"New York"}
                                        name={"state"}
                                        required
                                        className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="pb-2 font-semibold lg:text-lg">Phone</span>
                                    <input
                                        type={"text"}
                                        placeholder={"123-456-7890"}
                                        name={"phone"}
                                        required
                                        className={`remove-arrow h-[60px] rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                                    />
                                </label>
                            </div>
                        </div>
                        <hr />
                        <div className="">
                            <h1 className="mb-3 text-xl font-semibold">Payment Method</h1>
                            <label className="flex items-center justify-start gap-3 rounded-xl border border-gray-500 p-4">
                                {/* <input
                                type={"radio"}
                                placeholder={"John Doe"}
                                name={"payment-method"}
                                value={"RazorPay"}
                                required
                                className={`remove-arrow rounded-xl border border-solid border-[#D2D1D1] px-5 py-4 focus:outline-none`}
                            /> */}
                                <span className="lg:text-xl">
                                    <Img
                                        src={RazorpayLogo.src}
                                        alt="Razorpay"
                                        loader={
                                            <Img src={getImagePlaceholder(RazorpayLogo.width, RazorpayLogo.height)} />
                                        }
                                        className="h-8 w-min"
                                    />
                                </span>
                            </label>
                        </div>
                        <div className="rounded-xl border border-solid border-[#D2D1D1] p-3">
                            <h3 className="pb-3 text-2xl font-semibold">Order Summary</h3>
                            <hr />
                            {cartItems.length == 0 ? (
                                <div className="flex flex-col gap-3 py-3 font-semibold">
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Discount</p>
                                        <span>--</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Delivery</p>
                                        <span>--</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Package</p>
                                        <span>--</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Total</p>
                                        <span>--</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 py-3 font-semibold">
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Discount</p>
                                        <span>&#8377; 00.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Delivery</p>
                                        <span>&#8377; {(deliveryCharge / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Package</p>
                                        <span>&#8377; {(orderTotal / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Total</p>
                                        <span>&#8377; {((orderTotal + deliveryCharge) / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <PlaceOrderButton disabled={cartItems.length == 0} />
                    </form>

                    <div className="px-3 md:px-6">
                        <dialog open={showDialog} className="fixed top-0 h-full w-full bg-black/30">
                            <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-center">
                                {placeOrderState?.success && (
                                    <div className="flex items-center justify-center">
                                        <div className="rounded-xl bg-white p-10">
                                            <h1 className="text-3xl font-semibold">Order Placed</h1>
                                            <p className="text-lg">Your order has been placed successfully.</p>
                                            <>
                                                <p>Order ID: {placeOrderState.data}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Button
                                                        size={"lg"}
                                                        variant={"destructive"}
                                                        className="mt-5"
                                                        onClick={() => setShowDialog(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                    <Button
                                                        size={"lg"}
                                                        className="mt-5"
                                                        onClick={() => router.push(`/orders/${placeOrderState.data}`)}
                                                    >
                                                        Go to Orders Page
                                                    </Button>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </dialog>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Cart;
