import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoMdOpen } from "react-icons/io";
import { initiatePaymentForOrder, verifyPayment } from "@/serverActions/payments/payments.action";
import { useSession } from "next-auth/react";

function PaymentButton({ orderId }: { orderId: string }) {
    const [loading, setLoading] = React.useState(false);
    const session = useSession();
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    if (!session.data?.user) return null;
    const handlePayment = async () => {
        setLoading(true);
        initiatePaymentForOrder(orderId)
            .then((res) => {
                if (res.success) {
                    if (!session.data?.user) return null;
                    const { orderId, paymentOrderId, amount } = res.data;
                    const options = {
                        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                        amount: amount,
                        currency: "INR",
                        name: "Frameazy",
                        description: "Payment for your order with order id " + orderId,
                        order_id: paymentOrderId,
                        handler: function (response: any) {
                            verifyPayment(orderId, response.razorpay_order_id, response.razorpay_payment_id)
                                .then((res) => {
                                    if (res.success) {
                                        alert(JSON.stringify(res.data, null, 4));
                                        window.location.reload();
                                    } else {
                                        console.log(res.error);
                                        alert(res.error);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        },
                        prefill: {
                            name: session.data.user.name,
                            email: session.data.user.email,
                        },
                    };
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                } else {
                    console.log(res.error);
                    alert(res.error);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Button size={"lg"} disabled={loading} onClick={handlePayment}>
            {loading ? (
                "Processing...."
            ) : (
                <>
                    Pay with Razorpay&nbsp;
                    <IoMdOpen size={20} />
                </>
            )}
        </Button>
    );
}

export default PaymentButton;
