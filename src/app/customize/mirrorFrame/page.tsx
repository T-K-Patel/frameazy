"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import React, { useState, use } from "react";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { CartCustomization } from "@prisma/client";
import AddToCartDialog from "../AddToCartDialog";
import { unstable_calculateTotalPrice } from "@/utils/totalPrice";
import { Skeleton } from "@/components/ui/skeleton";
import { useFrames } from "../_hooks/useFrames";
import { toast } from "react-toastify";
import { useCustomizingFrame } from "../_hooks/useCustomizingFrame";
import { useOptions } from "../_hooks/useOptions";
import { VariantSelector } from "../VarientSelector";

type MirrorOptions = {
	dimensions: { width: number; height: number };
	mirrorType: {
		name: string;
		unit_price: number;
	};
};

type TSearchParams = {
	frameId: string | undefined;
};

function Page({ searchParams }: { searchParams: Promise<TSearchParams> }) {
	const sP = use(searchParams);
	const { frameId } = sP;
	const [mirror, setMirror] = useState<MirrorOptions>({
		dimensions: { width: 12, height: 9 },
		mirrorType: {
			name: "",
			unit_price: 0,
		},
	});
	const [frames, loading] = useFrames();
	const { customizingFrame, setCustomizingFrame, selectedvariant, selectVariant, selectedvariantInd } =
		useCustomizingFrame(frames, frameId);
	const [addingToCart, setAddingToCart] = useState(false);

	const [{ mirror: MirrorOptions }, mLoading] = useOptions(["mirror"]);

	const data: Omit<CartCustomization, "id"> = {
		type: "FramedMirror",
		width: mirror.dimensions.width,
		height: mirror.dimensions.height,
		image: null,
		mirror: mirror.mirrorType.name,
		glazing: "",
		printing: "",
		backing: "",
		stretching: "",
		sides: "",
		mat: [],
	};
	const price =
		unstable_calculateTotalPrice({
			height: data.height,
			width: data.width,
			frame: selectedvariant,
			mirrorRate: mirror.mirrorType.unit_price,
		}) / 100;

	const addToCart = (qty: number) => {
		if (!data.mirror) {
			toast.error("Please select mirror type");
			return;
		}
		setAddingToCart(true);
		// TODO: Extract this to a  separate function
		setTimeout(() => {
			setAddingToCart(false);
			console.log(qty);
			toast.success("Added to cart");
		}, 2000);
	};

	return (
		<>
			<div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
				<FrameCanvas
					totalSize={mirror.dimensions}
					frameBorder={
						customizingFrame
							? {
									borderWidth: selectedvariant.borderWidth || 0,
									src: customizingFrame.borderSrc || "",
								}
							: undefined
					}
				/>
				<div className="mx-auto flex w-11/12 flex-col gap-6">
					<h1 className="leading-auto text-3xl font-semibold">Framed mirror</h1>
					<div className="mb-3 flex flex-col gap-y-5">
						<div className="flex flex-col gap-y-8">
							<InputField
								label={<strong>Size</strong>}
								field={
									<div className="flex items-center gap-4">
										<Input
											type="number"
											min={(selectedvariant.borderWidth || 1 / 3) * 3}
											step={1}
											className="w-20 border border-gray-2 p-3 px-2 text-center"
											placeholder="0"
											value={mirror.dimensions.width}
											onChange={(e) => {
												setMirror({
													...mirror,
													dimensions: {
														...mirror.dimensions,
														width: parseInt(e.target.value),
													},
												});
											}}
										/>
										<p>X</p>
										<Input
											type="number"
											min={(selectedvariant.borderWidth || 1 / 3) * 3}
											step={1}
											className="w-20 border border-gray-2 p-3 px-2 text-center"
											placeholder="0"
											value={mirror.dimensions.height}
											onChange={(e) => {
												setMirror({
													...mirror,
													dimensions: {
														...mirror.dimensions,
														height: parseInt(e.target.value),
													},
												});
											}}
										/>
										<span className="pr-2 font-semibold">In</span>
									</div>
								}
							/>
							<InputField
								label={<strong>Frame</strong>}
								field={
									loading ? (
										<Skeleton className="h-8 rounded-xl md:h-24" />
									) : (
										<FrameDropdown
											items={frames}
											value={
												customizingFrame || {
													id: "",
													name: "",
													borderSrc: "",
													variants: [],
												}
											}
											onChangeAction={setCustomizingFrame}
										/>
									)
								}
							/>
							{customizingFrame?.variants.length ? (
								<InputField
									label={<strong>Frame Variant</strong>}
									field={
										<VariantSelector
											selectedVariant={selectedvariantInd}
											variants={customizingFrame?.variants || []}
											onSelect={selectVariant}
										/>
									}
								/>
							) : (
								<></>
							)}
							<InputField
								label={<strong>Mirror type</strong>}
								field={
									mLoading ? (
										<Skeleton className="h-8 rounded-xl" />
									) : (
										<DropDown
											value={mirror.mirrorType.name}
											onChange={(status: string) => {
												const mirrorType = MirrorOptions.find((m) => m.name === status) || {
													name: "",
													unit_price: 0,
												};
												setMirror({ ...mirror, mirrorType });
											}}
											items={MirrorOptions.map((m) => m.name)}
										/>
									)
								}
							/>
						</div>
						<div className="grid items-center gap-4 md:grid-cols-2">
							<div className="grid justify-between max-md:grid-cols-3 md:flex">
								<span>
									<strong>Price</strong>
								</span>
								<span className="text-2xl font-bold max-md:col-span-2">
									₹ {price > 0 ? price.toFixed(2) : "--"}
								</span>
							</div>
							<div>
								<AddToCartDialog addToCart={addToCart} addingToCart={addingToCart} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Page;
