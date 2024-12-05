"use client";
import React from "react";
import { Img } from "react-image";
import Select, { StylesConfig } from "react-select";

const DropDown = ({ items, value, onChange }: { items: string[]; value: string; onChange: any }) => {
    const options = items.map((item) => {
        return {
            value: item,
            label: item,
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
                label: !value || value == "" ? "--Select option--" : value,
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
    value: { id: string; borderSrc: string; name: string; unit_price: number; borderWidth: number };
    onChange: any;
}) => {
    const colourStyles: StylesConfig<any> = {
        control: (styles: any) => ({ ...styles, backgroundColor: "white", borderRadius: "8px", height: "max-content" }),
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
                    <>
                        <div className="flex gap-3 p-1">
                            <Img
                                src={value.borderSrc}
                                width={100}
                                height={50}
                                alt="frame"
                                className="max-w-28 object-cover"
                            />
                            <div>
                                <p>
                                    <strong>{value.name}</strong>
                                </p>
                                <p>
                                    <small>
                                        <>Inch Price</>: {(value.unit_price / 100).toFixed(2)} <strong>&#8377;</strong>
                                    </small>
                                </p>
                                <p>
                                    <small>
                                        <>Border Thickness</>: {value.borderWidth} <strong>In</strong>
                                    </small>
                                </p>
                            </div>
                        </div>
                        {/* {value.borderSrc} */}
                    </>
                ) : (
                    "--Select option--"
                ),
            }}
        />
    );
};

export default DropDown;
