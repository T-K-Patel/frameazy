import React, { ReactNode } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const CustomizeDropDown = ({ items }: { items: (string | ReactNode)[] }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={`flex w-full items-center justify-between overflow-hidden rounded-lg border border-gray-2 px-3 py-3`}
            >
                <p>{items[0]}</p>
                <RiArrowDropDownLine size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex w-full flex-col">
                {items.map((item, index) => (
                    <DropdownMenuItem className="w-full" key={index}>
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CustomizeDropDown;
