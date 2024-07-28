"use client"
import { useSession } from "next-auth/react"
import Image, { StaticImageData } from "next/image"
import DefaultImage from "../../../../public/Default.svg"
import { Button } from "@/components/ui/button"

type Order={
    id:string,
    price:number,
    date:Date,
    deliveryDate:Date,
    orderStatus:"Shipped"|"Delivered"|"Processing"|"Cancelled"|"Out for delivery",
    paymentStatus:"Pending"|"Completed"
}

const Order=({order}:{order:Order})=>{
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

const Dashboard=()=>{
    let user:any={
        name:"Samrudh Shetty",
        email:"samrudh3125@gmail.com",
        image:"",
        phone:"99999999999"
    };//getUserAction();//TODO get user action
    return (
        <div className="mx-auto w-11/12 max-w-screen-2xl flex flex-col gap-y-12 py-12">
            <section className="rounded-lg flex flex-col gap-6 border border-[#F1F1F1] p-3">
                <h1 className="font-semibold text-3xl leading-12 border-[#F1F1F1] border-b">User</h1>
                <div className="flex flex-wrap gap-5 rounded-lg">
                    <div className="flex flex-col gap-5 md:flex-row items-center">
                        <Image src={user.image||DefaultImage} alt={user.name} className="w-16 h-16 md:w-[171px] md:h-[171px]"/>
                        <div className="flex flex-col gap-5 p-5 rounded-3">
                           <p  className="flex gap-12">
                                <p className="flex justify-between">
                                    <h1 className="font-semibold text-xl leading-9 ">Name</h1>
                                    <h1 className="font-semibold text-xl leading-9 ">:</h1>
                                </p>
                                <h1 className="font-semibold text-xl leading-9 text-[#A3A1A1]">{user.name}</h1>
                           </p>
                           <p  className="flex gap-12">
                                <p className="flex justify-between">
                                    <h1 className="font-semibold text-xl leading-9 ">Email</h1>
                                    <h1 className="font-semibold text-xl leading-9 ">:</h1>
                                </p>
                                <h1 className="font-semibold text-xl leading-9 text-[#A3A1A1]">{user.email}</h1>
                           </p>
                           <p  className="flex gap-12">
                                <p className="flex justify-between">
                                    <h1 className="font-semibold text-xl leading-9 ">Phone Number</h1>
                                    <h1 className="font-semibold text-xl leading-9 ">:</h1>
                                </p>
                                <h1 className="font-semibold text-xl leading-9 text-[#A3A1A1]">{user.phone}</h1>
                           </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-11/12 rounded-5 flex flex-col gap-6">
                <h1 className="font-semibold text-3xl leading-12">Orders</h1>
                <Order order={{id:"1234",price:1000,date:new Date(),deliveryDate:new Date(),orderStatus:"Shipped",paymentStatus:"Pending"}}/>
            </section>
        </div>
    )
}

export default Dashboard;