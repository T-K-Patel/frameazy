import React from "react";

type Contact = {
    id: string;
    name: string;
    email: string;
    message: string;
    date: Date;
};

const ContactItem = ({ contact }: { contact: Contact }) => {
    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-[#F1F1F1] p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="pb-1 font-semibold leading-6">{contact.name}</h1>
                    <p className="text-sm font-semibold text-[#A3A1A1]">{contact.email}</p>
                </div>
                <p className="text-sm font-semibold">{contact.date.toDateString()}</p>
            </div>
            <p className="border border-[#D2D1D1]" />
            <p className="max-w-[1132px] text-sm font-semibold leading-5">{contact.message}</p>
        </div>
    );
};

const AdminContactPage = () => {
    return (
        <div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
            <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-5">
                <h1 className="leading-12 border-b border-[#F1F1F1] pb-5 text-3xl font-semibold">Orders</h1>
                <ContactItem
                    contact={{
                        id: "1234",
                        name: "John Doe",
                        email: "sample@gmail.com",
                        message:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        date: new Date(),
                    }}
                />
            </section>
        </div>
    );
};

export default AdminContactPage;
