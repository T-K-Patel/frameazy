import { Order } from "@/components/Order";
import React from "react";
import CustomizeDropDown from "@/components/CustomizeDropDown";

const AdminOrdersPage = () => {
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
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

export default AdminOrdersPage;
