"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import React, { use, useMemo, useState } from "react";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";
import useDebounce from "@/lib/useDebounce";
import AddToCartDialog from "../AddToCartDialog";
import { unstable_calculateTotalPrice } from "@/utils/totalPrice";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPTY_FRAME_FOR_CANVAS_OR_PANEL, EMPTY_FRAME_FOR_PAPER_ITEMS } from "@/contants/customizations";
import { useFrames } from "../_hooks/useFrames";
import { IOptions, useOptions } from "../_hooks/useOptions";
import { useCustomizingFrame } from "../_hooks/useCustomizingFrame";
import { VariantSelector } from "../VarientSelector";
import { toast } from "react-toastify";

type emptyFrameProps = {
	dimensions: { width: number; height: number };
	glazing?: string;
};

type matOptionsProps = {
	width: number;
	color: string;
	id: string;
}[];

type TSearchParams = {
	frameType: string | undefined;
	frameId: string | undefined;
};

function Page({ searchParams }: { searchParams: Promise<TSearchParams> }) {
	const sp = use(searchParams);
	const { frameType: _fT, frameId } = sp;
	const customizeOptions =
		_fT === EMPTY_FRAME_FOR_CANVAS_OR_PANEL ? EMPTY_FRAME_FOR_CANVAS_OR_PANEL : EMPTY_FRAME_FOR_PAPER_ITEMS;

	const arr: IOptions[] = useMemo(() => {
		return customizeOptions === EMPTY_FRAME_FOR_PAPER_ITEMS ? ["glazing"] : ([] as IOptions[]);
	}, [customizeOptions]);

	const [options, gLoading] = useOptions(arr);

	const _content = {
		[EMPTY_FRAME_FOR_CANVAS_OR_PANEL]: {
			title: "Empty frame for canvas or panel",
			warning: "Important! As shown, the frame will be cut to leave 3/8” between your subject and the floater.",
			mat: false,
			options: [],
		},
		[EMPTY_FRAME_FOR_PAPER_ITEMS]: {
			title: "Empty frame for paper items",
			warning:
				"Important! The opening will be cut exactly as typed. we recommend making opening smaller than art size so it does not fall through cutout",
			mat: true,
			options: [
				{
					title: "Glazing",
					items: options.glazing,
				},
			],
		},
	};

	const content = _content[customizeOptions];
	const [addingToCart, setAddingToCart] = useState(false);
	const [upload, setUpload] = useState<emptyFrameProps>({
		dimensions: { width: 12, height: 9 },
	});

	const [frames, loading] = useFrames();
	const { customizingFrame, setCustomizingFrame, selectedvariant, selectVariant, selectedvariantInd } =
		useCustomizingFrame(frames, frameId);

	const [mat, setMat] = useState<matOptionsProps>(content.mat ? [{ width: 0.5, color: "#ffffff", id: "1" }] : []);
	const debouncedFrame = useDebounce<emptyFrameProps>(upload, 300);
	const debouncedMat = useDebounce<matOptionsProps>(mat, 1000);

	const totalSize = debouncedMat.reduce(
		(acc, m) => {
			acc.width += m.width * 2;
			acc.height += m.width * 2;
			return { ...acc };
		},
		{
			width: debouncedFrame.dimensions.width + 2 * (selectedvariant?.borderWidth || 0),
			height: debouncedFrame.dimensions.height + 2 * (selectedvariant?.borderWidth || 0),
		},
	);

	const price =
		unstable_calculateTotalPrice({
			frame: { unit_price: selectedvariant.unit_price, borderWidth: selectedvariant.borderWidth },
			height: totalSize.height,
			width: totalSize.width,
			mat: mat,
			glazingRate:
				customizeOptions === EMPTY_FRAME_FOR_PAPER_ITEMS
					? options.glazing.find((g) => g.name === upload.glazing)?.unit_price
					: 0,
		}) / 100;

	const addToCart = (qty: number) => {
		if (!upload?.glazing && customizeOptions === EMPTY_FRAME_FOR_PAPER_ITEMS) {
			toast.error("Please select a glazing option");
			return;
		}

		if (customizingFrame && !customizingFrame.id) {
			toast.error("Please select a frame");
			return;
		}

		setAddingToCart(true);
		// TODO: Extract add to cart logic to a separate function
		setTimeout(() => {
			setAddingToCart(false);
			console.log(qty);
			toast.success("Added to cart");
		}, 2000);
	};

	return (
		<div className="grid min-h-[calc(100vh-150px)] gap-5 pb-4 pt-10 md:grid-cols-2">
			<FrameCanvas
				matOptions={debouncedMat}
				totalSize={totalSize}
				frameBorder={
					customizingFrame
						? {
								borderWidth: selectedvariant.borderWidth,
								src: customizingFrame.borderSrc,
							}
						: undefined
				}
			/>
			<div className="mx-auto flex w-11/12 flex-col gap-6">
				<h1 className="leading-auto text-3xl font-semibold">{content.title}</h1>
				<div className="mb-3 flex flex-col gap-y-5">
					<div className="flex gap-3 rounded-lg bg-yellow-300 p-3 px-5">
						{/* <BiX className="flex-shrink-0" /> */}
						<p className="text-justify">{content.warning}</p>
					</div>
					<div className="flex flex-col gap-y-8">
						<InputField
							label={<strong>Opening Size</strong>}
							field={
								<div className="flex items-center gap-4">
									<Input
										type="number"
										min={1}
										step={1}
										className="w-20 border border-gray-2 p-3 px-2 text-center"
										placeholder="0"
										value={upload.dimensions.width}
										onChange={(e) => {
											setUpload({
												...upload,
												dimensions: { ...upload.dimensions, width: Number(e.target.value) },
											});
										}}
									/>
									<p>X</p>
									<Input
										type="number"
										min={1}
										step={1}
										className="w-20 border border-gray-2 p-3 px-2 text-center"
										placeholder="0"
										value={upload.dimensions.height}
										onChange={(e) => {
											setUpload({
												...upload,
												dimensions: { ...upload.dimensions, height: Number(e.target.value) },
											});
										}}
									/>
									<span className="pr-2 font-semibold">In</span>
								</div>
							}
						/>
						{content.mat && (
							<InputField
								label={<strong>Mat</strong>}
								field={
									<div className="w-full">
										<div className="grid grid-cols-2 gap-6">
											<p>
												Width(<b>Inch</b>):
											</p>
											<p>Color:</p>
										</div>
										{mat.map((m, ind) => {
											return (
												<div
													className="mb-3 grid w-full grid-cols-2 items-center gap-6"
													key={ind}
												>
													<Input
														type="number"
														min={0.25}
														step={0.25}
														className="w-full border border-gray-2 p-2 text-center"
														placeholder="0"
														value={m.width}
														onChange={(e) => {
															setMat((_m) => {
																_m[ind].width = Number(e.target.value);
																return [..._m];
															});
														}}
													/>
													<div className="flex items-center gap-x-2">
														<Input
															className="h-10 w-full p-1"
															placeholder="white"
															value={m.color}
															type="color"
															onChange={(e) => {
																setMat((_m) => {
																	_m[ind].color = e.target.value;
																	return [..._m];
																});
															}}
														/>
														<IoCloseSharp
															className="flex-shrink-0 cursor-pointer"
															style={{ visibility: ind == 0 ? "hidden" : "visible" }}
															onClick={() => {
																if (ind != 0) {
																	setMat((_m) => _m.filter((rm) => rm.id != m.id));
																}
															}}
														/>
													</div>
												</div>
											);
										})}
										<button
											onClick={() => {
												setMat((m) => {
													return [
														...m,
														{
															width: 0.25,
															color: "#ffffff",
															id: new Date().toString(),
														},
													];
												});
											}}
											className="text-blue-1"
										>
											{" "}
											Add More Mat
										</button>
									</div>
								}
							/>
						)}
						<div className="flex flex-col gap-y-5">
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
													borderSrc: "",
													name: "",
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
							{customizeOptions === EMPTY_FRAME_FOR_PAPER_ITEMS && (
								<>
									<InputField
										label={<strong>Glazing</strong>}
										field={
											gLoading ? (
												<Skeleton className="h-8 rounded-xl md:h-24" />
											) : (
												<DropDown
													value={upload.glazing || ""}
													onChange={(status: string) => {
														setUpload({ ...upload, glazing: status });
													}}
													items={content.options[0].items.map((item) => item.name)}
												/>
											)
										}
									/>
								</>
							)}
							<InputField label={<strong>Printing</strong>} field={<span>No Printing</span>} />
						</div>
						<InputField
							label={<strong>Total Size</strong>}
							field={
								<p>
									<span>{totalSize.width}</span> <span>X</span> <span>{totalSize.height}</span>{" "}
									<span className="font-semibold">In</span>
								</p>
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
	);
}

export default Page;
