import { FramesForCustomizationType } from "@/app/api/frames/forCustomization/response";
import { useEffect, useState } from "react";

export function useCustomizingFrame(frames: FramesForCustomizationType[], frameId: string | undefined) {
	const [customizingFrame, setCustomizingFrame] = useState<FramesForCustomizationType | null>(null);
	const [selectedvariantInd, setSelectedvariant] = useState<number>(-1);

	useEffect(() => {
		if (frameId) {
			const selectedFrame = frames.find((frame) => frame.id === frameId);
			if (selectedFrame) {
				setCustomizingFrame(selectedFrame);
				if (selectedFrame.variants.length > 0) {
					setSelectedvariant(0);
				} else {
					setSelectedvariant(-1);
				}
			} else {
				setCustomizingFrame(null);
				setSelectedvariant(-1);
			}
		}
	}, [frameId, frames]);

	useEffect(() => {
		if (customizingFrame && customizingFrame.variants.length > 0) {
			setSelectedvariant(0);
		} else {
			setSelectedvariant(-1);
		}
	}, [customizingFrame]);

	const selectVariant = (index: number) => {
		if (customizingFrame && customizingFrame.variants.length > index) {
			setSelectedvariant(index);
		}
	};

	const selectedvariant = (selectedvariantInd >= 0 ? customizingFrame?.variants[selectedvariantInd] : null) || {
		borderWidth: 0,
		unit_price: 0,
	};

	return { customizingFrame, setCustomizingFrame, selectedvariant, selectedvariantInd, selectVariant };
}
