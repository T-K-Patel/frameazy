import Image from "next/image";
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

export const FrameDropdown = ({
    items,
    value,
    onChange,
}: {
    items: { value: string; label: React.ReactNode }[];
    value: { id: string; borderSrc: string; name: string };
    onChange: any;
}) => {
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
            options={items}
            filterOption={(option, rawInput) => {
                try {
                    return (option.label as any as { key: string }).key.toLowerCase().includes(rawInput.toLowerCase());
                } catch (error) {
                    return true;
                }
            }}
            classNames={{ singleValue: () => "flex justify-content-center h-min" }}
            value={{
                value: value.id,
                label: value.borderSrc ? (
                    <div className="flex max-w-full gap-3">
                        <Image
                            src={value.borderSrc}
                            alt={"Border Image"}
                            className="mx-auto flex-shrink"
                            width={80}
                            height={30}
                        />
                        <span className="flex-shrink-0">{value.name}</span>
                    </div>
                ) : (
                    "--Select option--"
                ),
            }}
        />
    );
};

export default DropDown;
