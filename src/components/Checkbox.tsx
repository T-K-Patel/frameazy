import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Checkbox = ({
	title,
	props,
	onChange,
	checked,
}: {
	title: string;
	props?: React.RefAttributes<HTMLInputElement> & React.ComponentProps<"input">;
	onChange: any;
	checked: boolean;
}) => {
	return (
		<>
			<Label className="flex cursor-pointer gap-2">
				<Input
					type="checkbox"
					className="w-4 flex-shrink-0"
					{...props}
					id={props?.name}
					value={title}
					checked={checked}
					onChange={(e) => {
						onChange(e.target.checked);
					}}
				/>
				<span className="pt-1 text-[0.9rem] font-medium">{title}</span>
			</Label>
		</>
	);
};

export default Checkbox;
