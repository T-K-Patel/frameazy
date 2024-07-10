import React, { ReactNode } from "react";

function InputField({ label, field }: { [k: string]: ReactNode }) {
    return (
        <div className="grid grid-cols-3 items-center">
            <div className="col-span-1">{label}</div>
            <div className="col-span-2">{field}</div>
        </div>
    );
}

export default InputField;
