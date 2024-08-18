import { Button } from "./ui/button";
import { UserOrders } from "@/serverActions/orders/orders.action";
import Link from "next/link";
import { AdminOrdersType } from "@/serverActions/admin/admin.action";

const OrderComponent = ({ order }: { order: UserOrders | AdminOrdersType }) => {
    return (
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-[#F1F1F1] px-3 py-4 md:flex-row">
            <div className="grid flex-grow grid-cols-1 gap-2 border-[#F1F1F1] md:grid-cols-3 md:border-r">
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Order ID
                    </p>
                    <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                        ...{order.id.substring(15)}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Date
                    </p>
                    <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                        {order.createdAt.toDateString()}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                        Total
                    </p>
                    <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                        {Math.ceil((order.delivery_charge + order.packaging - order.discount) * 100) / 100}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-y-2 md:col-span-3 md:gap-y-0">
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                            Order Status
                        </p>
                        <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                            {order.order_status}
                        </p>
                    </div>
                </div>
                <div className="grid gap-2 md:col-span-3 md:grid-cols-2">
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="col-span-1 text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                            Delivery by
                        </p>
                        <p className="col-span-1 text-sm font-semibold leading-5 md:text-base lg:text-lg">
                            {order.delivery_date.toDateString()}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="text-sm font-semibold leading-5 text-[#A3A1A1] md:text-base lg:text-lg">
                            Payment Status
                        </p>
                        <p
                            className={`font-semibold leading-6 ${order.transaction_status === "Pending" ? "text-[#D68D00]" : "text-[#008C0E]"}`}
                        >
                            {order.transaction_status}
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid flex-shrink-0 gap-x-1 gap-y-2 sm:grid-cols-2 md:grid-cols-1">
                <Link href={`orders/${order.id}`}>
                    <Button
                        className="w-full overflow-hidden whitespace-normal break-words text-xs lg:text-base"
                        size={"lg"}
                    >
                        Order details +
                    </Button>
                </Link>
                <Button
                    className="w-fill overflow-hidden whitespace-normal break-words text-xs lg:text-base"
                    size={"lg"}
                >
                    Download Invoice
                </Button>
            </div>
        </div>
    );
};

export { OrderComponent };
