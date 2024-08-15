import React from "react";
import Select, { StylesConfig } from "react-select";

const DropDown = ({ items, value, onChange }: { items: string[]; value: string; onChange: any }) => {
    const options = items.map((item) => {
        return {
            value: item,
            label: item
                .replace(/_/g, " + ")
                .replace(/([A-Z])/g, " $1")
                .trim(),
        };
    });
    const colourStyles: StylesConfig<any> = {
        control: (styles: any) => ({ ...styles, backgroundColor: "white", borderRadius: "8px" }),
        option: (styles, { isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? "#ccc" : "white",
                color: isDisabled ? "#ccc" : "black",
                fontWeight: isSelected ? "bold" : "normal",
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
            value={{
                value,
                label:
                    !value || value == ""
                        ? "--Select option--"
                        : value
                              .replace(/_/g, " + ")
                              .replace(/([A-Z])/g, " $1")
                              .trim(),
            }}
        />
    );
};

export default DropDown;
