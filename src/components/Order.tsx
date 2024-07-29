import { Button } from "./ui/button"

type Order={
    id:string,
    price:number,
    date:Date,
    deliveryDate:Date,
    orderStatus:"Shipped"|"Delivered"|"Processing"|"Cancelled"|"Out for delivery",
    paymentStatus:"Pending"|"Completed"
}

export const Order=({order}:{order:Order})=>{
    return (
        <div className="rounded-lg border border-[#F1F1F1] px-3 py-4 flex flex-col gap-y-3 gap-x-5 md:flex-row">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-y-2 md:gap-5 md:flex-wrap md:flex-row border-[#F1F1F1] md:border-r">
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="font-semibold text-sm leading-5 text-[#A3A1A1] col-span-1">Order ID</p>
                    <p className="font-semibold text-sm leading-5 col-span-1">{order.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="font-semibold text-sm leading-5 text-[#A3A1A1] col-span-1">Date</p>
                    <p className="font-semibold text-sm leading-5 col-span-1">{order.date.toDateString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-2 md:flex">
                    <p className="font-semibold text-sm leading-5 text-[#A3A1A1] col-span-1">Total</p>
                    <p className="font-semibold text-sm leading-5 col-span-1">{order.price}</p>
                </div>
                <div className="grid grid-cols-1 gap-y-2 md:gap-y-0 md:col-span-2">
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="font-semibold text-sm leading-5 text-[#A3A1A1] col-span-1">Order Status</p>
                        <p className="font-semibold text-sm leading-5 col-span-1">{order.orderStatus}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 md:flex">
                        <p className="font-semibold text-sm leading-5 text-[#A3A1A1] col-span-1">Delivery by</p>
                        <p className="font-semibold text-sm leading-5 col-span-1">{order.deliveryDate.toDateString()}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                    <p className="font-semibold text-sm leading-5 text-[#A3A1A1]">Payment Status</p>
                    <p className={`font-semibold leading-6 ${order.paymentStatus==="Pending"?"text-[#D68D00]":"text-[#008C0E]"}`}>{order.paymentStatus}</p>
                </div>
            </div>
            <div className="flex gap-2 md:flex-col">
                <Button size={"lg"}>Order details +</Button>
                <Button size={"lg"}>Download Invoice</Button>
            </div>
        </div>
    )
}

