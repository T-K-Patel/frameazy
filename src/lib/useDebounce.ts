import { useEffect, useState } from "react";

/**
 *
 * @type V Type of the value
 * @param value Value to debounce
 * @param delay Delay in ms
 * @returns
 */
export default function useDebounce<V>(value: V, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
