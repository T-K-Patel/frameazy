import Image, { StaticImageData } from "next/image";
import DefaultImage from "../../../../public/Default.svg";
import { Order } from "@/components/Order";

const Dashboard = () => {
    let user = {
        name: "Samrudh Shetty",
        email: "samrudh3125@gmail.com",
        image: "",
        phone: "99999999999",
    }; // getUserAction(); // TODO get user action

    return (
        <div className="mx-auto w-5/6 max-w-screen-2xl py-12">
            <section className="mb-12 overflow-hidden rounded-lg border border-[#F1F1F1] p-3">
                <header>
                    <h1 className="leading-12 border-b border-[#F1F1F1] pb-3 text-3xl font-semibold">User</h1>
                </header>
                <div className="mt-6">
                    <div className="grid grid-cols-1 place-items-center md:grid-cols-3">
                        <Image
                            src={user.image || DefaultImage}
                            alt={user.name}
                            className="max-h-3/4 max-w-43 col-span-1 mb-6 h-16 w-16 md:mb-0 md:mr-6 md:h-1/2 md:w-1/2"
                        />
                        <div className="rounded-md p-5">
                            <div className="mb-5 grid grid-cols-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold leading-9 md:text-xl">Name</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="ml-12 font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {user.name}
                                </span>
                            </div>
                            <div className="mb-5 grid grid-cols-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold leading-9 md:text-xl">Email</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="ml-12 font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {user.email}
                                </span>
                            </div>
                            <div className="mb-5 grid grid-cols-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold leading-9 md:text-xl">Phone Number</span>
                                    <span className="font-semibold leading-9 md:text-xl">:</span>
                                </div>
                                <span className="ml-12 font-semibold leading-9 text-[#A3A1A1] md:text-xl">
                                    {user.phone}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-12 rounded-md border border-[#F1F1F1] p-3">
                <header>
                    <h1 className="leading-12 mb-6 text-3xl font-semibold">Orders</h1>
                </header>
                <Order
                    order={{
                        id: "1234",
                        price: 1000,
                        date: new Date(),
                        deliveryDate: new Date(),
                        orderStatus: "Shipped",
                        paymentStatus: "Pending",
                    }}
                />
            </section>
        </div>
    );
};

export default Dashboard;
