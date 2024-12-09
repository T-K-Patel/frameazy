import { FramesForCustomizationType } from "@/app/api/frames/forCustomization/response";
import { useEffect, useState } from "react";

export const useFrames = (_fetch = true) => {
	const [frames, setFrames] = useState<FramesForCustomizationType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!_fetch) return setLoading(false);
		fetch("/api/frames/forCustomization")
			.then((res) => res.json())
			.then((data) => {
				setFrames(data);
			})
			.catch((err) => {
				console.log(err);
				alert("Something went wrong");
			})
			.finally(() => {
				setLoading(false);
			});
		// getFramesForCustomizatinAction()
		//     .then((res) => {
		//         if (res.success) {
		//             setFrames(res.data);
		//         }
		//     })
		//     .catch((err) => {
		//         console.log(err);
		//         alert("Something went wrong");
		//     })
		//     .finally(() => {
		//         setLoading(false);
		//     });
	}, [_fetch]);

	return [frames, loading] as [FramesForCustomizationType[], boolean];
};
