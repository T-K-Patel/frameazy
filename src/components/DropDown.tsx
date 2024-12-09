"use client";
import React from "react";
import { Img } from "@/components/Img";
import Select, { StylesConfig } from "react-select";
import { FramesForCustomizationType } from "@/app/api/frames/forCustomization/response";

const DropDown = ({ items, value, onChange }: { items: string[]; value: string; onChange: any }) => {
	const options = items.map((item) => {
		return {
			value: item,
			label: item,
		};
	});
	const colourStyles: StylesConfig<any> = {
		control: (styles) => ({ ...styles, backgroundColor: "white", borderRadius: "8px" }),
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
			isDisabled={items.length === 0}
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
	onChangeAction,
}: {
	items: FramesForCustomizationType[];
	value: FramesForCustomizationType;
	onChangeAction: (frame: FramesForCustomizationType | null) => void;
}) => {
	const colourStyles: StylesConfig<any> = {
		control: (styles) => ({ ...styles, backgroundColor: "white", borderRadius: "8px", height: "max-content" }),
		option: (styles, { isDisabled, isFocused, isSelected }) => {
			return {
				...styles,
				backgroundColor: isFocused ? "#ccc" : "white",
				color: isDisabled ? "#ccc" : "black",
				fontWeight: isSelected ? "bold" : "normal",
			};
		},
	};

	const handleOnChange = ({ value }: { value: string }) => {
		const selectedFrame = items.find((frame) => frame.id === value);
		onChangeAction(selectedFrame || null);
	};

	const options = items.map((item) => {
		return {
			value: item.id,
			label: (
				<div className="flex h-full gap-3 align-middle" key={item.name + item.id}>
					<Img
						src={item.borderSrc}
						width={500}
						height={150}
						alt="frame"
						className="max-h-16 max-w-36 object-fill"
					/>
					<div className="my-auto">
						<p>{item.name}</p>
					</div>
				</div>
			),
		};
	});
	return (
		<Select
			isDisabled={items.length === 0}
			onChange={handleOnChange}
			styles={colourStyles}
			options={options}
			filterOption={(option, rawInput) => {
				try {
					return (option.label as any as { key: string }).key.toLowerCase().includes(rawInput.toLowerCase());
				} catch {
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
								{/* <p>
									<small>
										<>Inch Price</>: {(value.unit_price / 100).toFixed(2)} <strong>&#8377;</strong>
									</small>
								</p>
								<p>
									<small>
										<>Border Thickness</>: {value.borderWidth} <strong>In</strong>
									</small>
								</p> */}
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
