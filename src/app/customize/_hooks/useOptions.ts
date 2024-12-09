import { useEffect, useState } from "react";

export type IOptions = "mat" | "sides" | "glazing" | "backing" | "printing" | "stretching" | "mirror";
export type TOption = {
	name: string;
	unit_price: number;
};
export type TOptions = {
	mat: TOption[];
	glazing: TOption[];
	backing: TOption[];
	printing: TOption[];
	stretching: TOption[];
	mirror: TOption[];
	sides: TOption[];
};

export function useOptions(name: IOptions[]) {
	const [options, setOptions] = useState<TOptions>({
		mat: [],
		glazing: [],
		backing: [],
		printing: [],
		stretching: [],
		mirror: [],
		sides: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (name.length > 0) {
			const query = name.map((n) => `${n}=true`).join("&");
			fetch(`/api/options/customizationOptions?${query}`)
				.then((res) => res.json())
				.then((data) => {
					setOptions(data);
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [name]);

	return [options, loading] as [TOptions, boolean];
}
