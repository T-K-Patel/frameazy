import React, { ReactNode } from "react";

function InputField({ label, field }: { [k: string]: ReactNode }) {
	return (
		<div className="grid grid-cols-3 items-center">
			<div className="col-span-1 max-md:text-sm">{label}</div>
			<div className="col-span-2 max-md:text-sm">{field}</div>
		</div>
	);
}

export default InputField;
