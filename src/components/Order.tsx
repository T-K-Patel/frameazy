import { Button } from "./ui/button";

type Order = {
    id: string;
    price: number;
    date: Date;
    deliveryDate: Date;
    orderStatus: "Shipped" | "Delivered" | "Processing" | "Cancelled" | "Out for delivery";
    paymentStatus: "Pending" | "Completed";
};

const Order = ({ order }: { order: Order }) => {
    return (
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-[#F1F1F1] px-3 py-4 md:flex-row">
            <div className="grid flex-grow grid-cols-1 gap-y-2 border-[#F1F1F1] md:grid-cols-3 md:border-r">
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Order ID
                    </p>
                    <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">{order.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Date
                    </p>
                    <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                        {order.date.toDateString()}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Total
                    </p>
                    <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">{order.price}</p>
                </div>
                <div className="grid grid-cols-1 gap-y-2 md:col-span-2 md:gap-y-0">
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                            Order Status
                        </p>
                        <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                            {order.orderStatus}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                            Delivery by
                        </p>
                        <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                            {order.deliveryDate.toDateString()}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:pt-6">
                    <p className="text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Payment Status
                    </p>
                    <p
                        className={`font-semibold leading-6 ${order.paymentStatus === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                    >
                        {order.paymentStatus}
                    </p>
                </div>
            </div>
            <div className="grid flex-shrink-0 grid-cols-2 gap-x-1 gap-y-2 md:grid-cols-1">
                <Button className="overflow-hidden whitespace-normal break-words text-xs lg:text-base" size={"lg"}>
                    Order details +
                </Button>
                <Button className="overflow-hidden whitespace-normal break-words text-xs lg:text-base" size={"lg"}>
                    Download Invoice
                </Button>
            </div>
        </div>
    );
};

export { Order };