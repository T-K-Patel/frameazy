import React, { InputHTMLAttributes } from "react";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";

const Checkbox = ({ title, props }: { title: string; props?: InputProps & React.RefAttributes<HTMLInputElement> }) => {
    return (
        <>
            <Label className="flex cursor-pointer gap-2 font-normal">
                <Input type="checkbox" className="w-4 flex-shrink-0" {...props} id={props?.name} value={title} />
                <span className="text-[1rem]">{title}</span>
            </Label>
        </>
    );
};

export default Checkbox;
