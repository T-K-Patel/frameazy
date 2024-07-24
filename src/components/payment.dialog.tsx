// IMPORTANT: Don't import Razorpay here as it is defined by script included in root layout
import { Button } from "@/components/ui/button";
import React from "react";
import { IoMdOpen } from "react-icons/io";

function PaymentDialog({
    data,
    closeDialog,
}: {
    data: {
        orderId: string;
        orderTotal: number;
        paymentIntentId: string;
        paymentMethodId: string;
    };
    closeDialog: () => void;
}) {
    const handlePayment = async () => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.orderTotal,
            currency: "INR",
            name: "Your Company Name",
            description: "Test Transaction",
            order_id: data.orderId,
            handler: function (response: any) {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        // @ts-ignore
        const rzp1 = new globalThis.window.Razorpay(options); // NOTE: Razorpay is defined by script included in root layout
        rzp1.open();
    };
    return (
        <div className="flex items-center justify-center">
            <div className="rounded-xl bg-white p-10">
                <h1 className="text-3xl font-semibold">Order Placed</h1>
                <p className="text-lg">Your order has been placed successfully.</p>
                <>
                    <p>Order ID: {data.orderId}</p>
                    <p>Amount: {data.orderTotal}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Button size={"lg"} variant={"destructive"} className="mt-5" onClick={closeDialog}>
                            Pay Later
                        </Button>
                        <Button size={"lg"} className="mt-5" onClick={handlePayment}>
                            Pay {data.orderTotal}&nbsp;
                            <IoMdOpen size={20} />
                        </Button>
                    </div>
                </>
            </div>
        </div>
    );
}

export default PaymentDialog;
