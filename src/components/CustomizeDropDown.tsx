"use client";
import React, { ReactNode } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Item = ({ status, value }: { status: string; value: string }) => {
    return (
        <p className={`text-lg font-semibold ${value === status ? "text-[#A3A1A1]" : "text-black"} text-center`}>
            {status}
        </p>
    );
};
const CustomizeDropDown = ({ items, value, onChange }: { items: string[]; value: string; onChange: any }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                value={value}
                className={`flex w-full items-center justify-between overflow-hidden rounded-lg border border-gray-2 px-3 py-3`}
            >
                <p>{value}</p>
                <RiArrowDropDownLine size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {items.map((item, index) => (
                    <DropdownMenuItem
                        onClick={() => {
                            onChange(item);
                        }}
                        key={index}
                    >
                        <Item status={item} value={value} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CustomizeDropDown;
