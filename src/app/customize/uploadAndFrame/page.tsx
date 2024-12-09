"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { Input } from "@/components/ui/input";
import React, { use, useEffect, useState } from "react";
import InputField from "../InputField";
import FrameCanvas from "../FrameCanvas";
import { IoCloseSharp } from "react-icons/io5";
import { Glazing, Printing, Backing, Stretching, Sides, CartCustomization } from "@prisma/client";
import { FramesForCustomizationType } from "@/serverActions/frames/frame.action";
import AddToCartDialog from "../AddToCartDialog";
import { unstable_calculateTotalPrice } from "@/utils/totalPrice";
import { Skeleton } from "@/components/ui/skeleton";
import { useFrames } from "../_hooks/useFrames";
import { useCustomizingFrame } from "../_hooks/useCustomizingFrame";
import {
	UPLOAD_AND_FRAME_PRINT_ONLY,
	UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
	UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING,
	UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING,
} from "@/contants/customizations";
import { IOptions, useOptions } from "../_hooks/useOptions";
import { toast } from "react-toastify";
import { VariantSelector } from "../VarientSelector";

type CustomizeOptionsProps =
	| {
			title: "Frame";
			items: FramesForCustomizationType[];
	  }
	| {
			title: "Glazing" | "Printing" | "Backing" | "Stretching" | "Sides";
			items: { name: string; unit_price: number }[];
	  };

type uploadOptionsProps = {
	dimensions: { width: number; height: number };
	glazing?: Glazing;
	printing: Printing;
	backing?: Backing;
	stretching?: Stretching;
	sides?: Sides;
};

type matOptionsProps = {
	width: number;
	color: string;
	id: string;
}[];

type ContentType = { title: string; mat: boolean; options: CustomizeOptionsProps[] };

type TSearchParams = {
	frameId: string | undefined;
	frameType: string | undefined;
	w: number | undefined;
	h: number | undefined;
	ci: string | undefined;
	ext: string | undefined;
};

type TFrameType =
	| typeof UPLOAD_AND_FRAME_PRINT_ONLY
	| typeof UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT
	| typeof UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING
	| typeof UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING;

function Page({ searchParams }: { searchParams: Promise<TSearchParams> }) {
	const sP = use(searchParams);
	const { frameId, frameType: _fT, w, h, ci, ext } = sP;
	const frameType: TFrameType = [
		UPLOAD_AND_FRAME_PRINT_ONLY,
		UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
		UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING,
		UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING,
	].includes(_fT || "")
		? (_fT as TFrameType)
		: UPLOAD_AND_FRAME_PRINT_ONLY;
	const width = Number(w) > 0 ? Number(w) : 0;
	const height = Number(h) > 0 ? Number(h) : 0;
	const croppedImage = ci;
	const usingExternalImage = ext === "true";
	console.log(usingExternalImage);

	const [upload, setUpload] = useState<uploadOptionsProps>({
		dimensions: { width: 0, height: 0 },
		printing: {
			id: "",
			name: "",
			unit_price: 0,
		},
	});

	const [frames, fLoading] = useFrames(
		frameType === UPLOAD_AND_FRAME_PRINT_ONLY || frameType === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
	);
	const { customizingFrame, setCustomizingFrame, selectVariant, selectedvariant, selectedvariantInd } =
		useCustomizingFrame(frames, frameId);
	const [mat, setMat] = useState<matOptionsProps>([{ width: 0.75, color: "#ffffff", id: "1" }]);

	const [addingToCart, setAddingToCart] = useState(false);

	useEffect(() => {
		switch (frameType) {
			case UPLOAD_AND_FRAME_PRINT_ONLY:
				setUpload({
					dimensions: { width, height },
					printing: {
						id: "",
						name: "",
						unit_price: 0,
					},
				});
				break;
			case UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT:
				setUpload({
					dimensions: { width, height },
					printing: {
						id: "",
						name: "",
						unit_price: 0,
					},
					backing: {
						id: "",
						name: "",
						unit_price: 0,
					},
					stretching: {
						id: "",
						name: "",
						unit_price: 0,
					},
					sides: {
						id: "",
						name: "",
						unit_price: 0,
					},
				});
				break;
			case UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING:
				setUpload({
					dimensions: { width, height },
					printing: {
						id: "",
						name: "",
						unit_price: 0,
					},
					stretching: {
						id: "",
						name: "",
						unit_price: 0,
					},
				});
				break;
			case UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING:
				setUpload({
					dimensions: { width, height },
					glazing: {
						id: "",
						name: "",
						unit_price: 0,
					},
					printing: {
						id: "",
						name: "",
						unit_price: 0,
					},
					backing: {
						id: "",
						name: "",
						unit_price: 0,
					},
				});
				break;
		}
	}, [frames, frameType, width, height]);

	const _optionsKey: IOptions[] = [];

	if (frameType === UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING) {
		_optionsKey.push("glazing");
		_optionsKey.push("printing");
		_optionsKey.push("backing");
	} else if (frameType === UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING) {
		_optionsKey.push("printing");
		_optionsKey.push("stretching");
	} else if (frameType === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT) {
		_optionsKey.push("printing");
		_optionsKey.push("stretching");
		_optionsKey.push("sides");
	} else if (frameType === UPLOAD_AND_FRAME_PRINT_ONLY) {
		_optionsKey.push("printing");
	}

	const [options, oLoading] = useOptions(_optionsKey);

	const customizeOptions = frameType;
	let content: ContentType = {
		title: "Framed print with mat & glazing",
		mat: true,
		options: [
			{
				title: "Frame",
				items: frames,
			},
			{
				title: "Glazing",
				items: options.glazing,
			},
			{
				title: "Printing",
				items: options.printing,
			},
			{
				title: "Backing",
				items: options.backing,
			},
		],
	};

	if (customizeOptions === UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING) {
		content = {
			title: "Framed print without mat and glazing",
			mat: false,
			options: [
				{
					title: "Frame",
					items: frames,
				},
				{
					title: "Printing",
					items: options.printing,
				},
				{
					title: "Stretching",
					items: options.stretching,
				},
			],
		};
	} else if (customizeOptions === UPLOAD_AND_FRAME_PRINT_ONLY) {
		content = {
			title: "Print only",
			mat: false,
			options: [
				{
					title: "Printing",
					items: options.printing,
				},
			],
		};
	} else if (customizeOptions === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT) {
		content = {
			title: "Stretched canvas print",
			mat: false,
			options: [
				{
					title: "Printing",
					items: options.printing,
				},
				{
					title: "Stretching",
					items: options.stretching,
				},
				{
					title: "Sides",
					items: options.sides,
				},
			],
		};
	}

	if (!content.mat && mat.length > 0) {
		setMat([]);
	}

	const totalSize = mat.reduce(
		(acc, m) => {
			acc.width += m.width * 2;
			acc.height += m.width * 2;
			return { ...acc };
		},
		{
			width: width + 2 * (selectedvariant?.borderWidth || 0),
			height: height + 2 * (selectedvariant?.borderWidth || 0),
		},
	);
	const data: Omit<CartCustomization, "id"> = {
		type: frameType,
		width: totalSize.width,
		height: totalSize.height,
		image: croppedImage as string,
		mirror: "",
		glazing: upload.glazing?.name || "",
		printing: upload.printing?.name || "",
		backing: upload.backing?.name || "",
		stretching: upload.stretching?.name || "",
		sides: upload.sides?.name || "",
		mat: mat.map((m) => ({ color: m.color, width: m.width })),
	};

	const price =
		unstable_calculateTotalPrice({
			frame: selectedvariant,
			height: height,
			width: width,
			// TODO: account for options rate
		}) / 100;

	const addToCart = (qty: number) => {
		if (!data.glazing && customizeOptions === UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING) {
			toast.error("Please select a glazing option");
			return;
		}
		if (!data.printing) {
			toast.error("Please select a printing option");
			return;
		}
		if (!data.backing && customizeOptions === UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING) {
			toast.error("Please select a backing option");
			return;
		}
		if (
			!data.stretching &&
			(customizeOptions === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT ||
				customizeOptions === UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING)
		) {
			toast.error("Please select a stretching option");
			return;
		}
		if (!data.sides && customizeOptions === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT) {
			toast.error("Please select a sides option");
			return;
		}

		if (
			customizingFrame &&
			[UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING, UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING].includes(frameType) &&
			!customizingFrame.id
		) {
			toast.error("Please select a frame");
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
					image={{ src: croppedImage as string, ...upload.dimensions }}
					matOptions={mat}
					totalSize={totalSize}
					frameBorder={
						customizingFrame &&
						[UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING, UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING].includes(
							frameType,
						)
							? {
									borderWidth: selectedvariant.borderWidth || 0,
									src: customizingFrame.borderSrc || "",
								}
							: undefined
					}
				/>
				<div className="mx-auto flex w-11/12 flex-col gap-6">
					<h1 className="leading-auto text-3xl font-semibold">{content.title}</h1>
					<div className="mb-3 flex flex-col gap-y-5">
						<div className="flex flex-col gap-y-8">
							<InputField
								label={<strong>Size</strong>}
								field={
									<p>
										<span>{width}</span> <span>X</span> <span>{height}</span>{" "}
										<span className="font-semibold">In</span>
									</p>
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
															{ind != 0 && (
																<IoCloseSharp
																	className="flex-shrink-0 cursor-pointer"
																	onClick={() => {
																		setMat((_m) => {
																			return _m.filter((rm) => {
																				return rm.id != m.id;
																			});
																		});
																	}}
																/>
															)}
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
																width: 0.75,
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
								{(customizeOptions === UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING ||
									customizeOptions == UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING) && (
									<>
										<InputField
											label={<strong>Frame</strong>}
											field={
												fLoading ? (
													<Skeleton className="h-8 rounded-xl md:h-24" />
												) : (
													<FrameDropdown
														items={frames}
														onChangeAction={setCustomizingFrame}
														value={
															customizingFrame || {
																id: "",
																name: "",
																borderSrc: "",
																variants: [],
															}
														}
													/>
												)
											}
										/>
									</>
								)}
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
								{content.options.map((option, index) => {
									if (option.title === "Frame") {
										return <></>;
									}
									return (
										<InputField
											key={index}
											label={<strong>{option.title}</strong>}
											field={
												oLoading ? (
													<Skeleton className="h-8 rounded-xl" />
												) : (
													<DropDown
														value={
															upload[
																option.title.toLowerCase() as
																	| "glazing"
																	| "printing"
																	| "backing"
																	| "stretching"
																	| "sides"
															]?.name || ""
														}
														onChange={(status: string) => {
															const _option = option.items.find(
																(o) => o.name === status,
															) || {
																name: "",
																unit_price: 0,
															};

															setUpload((u) => {
																return {
																	...u,
																	[option.title.toLowerCase()]: _option,
																};
															});
														}}
														items={option.items.map((i) => i.name)}
													/>
												)
											}
										/>
									);
								})}
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
								<span className="text-2xl font-bold max-md:col-span-2">₹ {price.toFixed(2)}</span>
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
