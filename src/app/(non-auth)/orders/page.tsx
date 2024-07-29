import Image, { StaticImageData } from "next/image";
import DefaultImage from "../../../../public/Default.svg";
import { Order } from "@/components/Order";

const Dashboard = () => {
    let user = {
        name: "Samrudh Shetty",
        email: "samrudh3125@gmail.com",
        image: "",
        phone: "99999999999"
    }; // getUserAction(); // TODO get user action

    return (
        <div className="mx-auto w-11/12 max-w-screen-2xl py-12">
            <section className="rounded-lg border border-[#F1F1F1] p-3 mb-12">
                <header>
                    <h1 className="font-semibold text-3xl leading-12 border-[#F1F1F1] border-b pb-3">User</h1>
                </header>
                <div className="mt-6">
                    <div className="flex flex-col md:flex-row items-center justify-center">
                        <Image src={user.image || DefaultImage} alt={user.name} className="w-16 h-16 md:w-[171px] md:h-[171px] mb-6 md:mb-0 md:mr-6" />
                        <div className="p-5 rounded-md">
                            <div className="mb-5 flex">
                                <div className="flex justify-between ">
                                    <span className="font-semibold text-xl leading-9">Name</span>
                                    <span className="font-semibold text-xl leading-9">:</span>
                                </div>
                                <span className="font-semibold text-xl leading-9 text-[#A3A1A1] ml-12">{user.name}</span>
                            </div>
                            <div className="mb-5 flex">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-xl leading-9">Email</span>
                                    <span className="font-semibold text-xl leading-9">:</span>
                                </div>
                                <span className="font-semibold text-xl leading-9 text-[#A3A1A1] ml-12">{user.email}</span>
                            </div>
                            <div className="mb-5 flex">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-xl leading-9">Phone Number</span>
                                    <span className="font-semibold text-xl leading-9">:</span>
                                </div>
                                <span className="font-semibold text-xl leading-9 text-[#A3A1A1] ml-12">{user.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-11/12 rounded-md mb-12">
                <header>
                    <h1 className="font-semibold text-3xl leading-12 mb-6">Orders</h1>
                </header>
                <Order order={{ id: "1234", price: 1000, date: new Date(), deliveryDate: new Date(), orderStatus: "Shipped", paymentStatus: "Pending" }} />
            </section>
        </div>
    );
}

export default Dashboard;
