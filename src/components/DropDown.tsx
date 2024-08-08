import React from "react";
import Select, { StylesConfig } from "react-select";

const DropDown = ({ items, value, onChange }: { items: string[]; value: string; onChange: any }) => {
    const options = items.map((item) => {
        return { value: item, label: item };
    });
    const colourStyles: StylesConfig<any> = {
        control: (styles: any) => ({ ...styles, backgroundColor: "white", borderRadius: "8px" }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? "#ccc" : "white",
                color: isDisabled ? "#ccc" : isSelected ? "#A3A1A1" : "black",
            };
        },
    };
    return (
        <Select
            onChange={(e) => {
                onChange(e.value);
            }}
            styles={colourStyles}
            options={options}
            value={{ value, label: value }}
        />
    );
};

export default DropDown;
