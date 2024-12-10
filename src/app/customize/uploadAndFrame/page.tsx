"use client";
import DropDown, { FrameDropdown } from "@/components/DropDown";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	INDEXED_DB_UAF_DATA_KEY,
	UPLOAD_AND_FRAME_PRINT_ONLY,
	UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
	UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING,
	UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING,
} from "@/contants/customizations";
import { FramesForCustomizationType } from "@/serverActions/frames/frame.action";
import { unstable_calculateTotalPrice } from "@/utils/totalPrice";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import AddToCartDialog from "../AddToCartDialog";
import FrameCanvas from "../FrameCanvas";
import InputField from "../InputField";
import { VariantSelector } from "../VarientSelector";
import { useCustomizingFrame } from "../_hooks/useCustomizingFrame";
import { useFrames } from "../_hooks/useFrames";
import useIndexedDBObjectStorage from "../_hooks/useIndexedDBObjectStorage";
import { IOptions, useOptions } from "../_hooks/useOptions";

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
	glazing?: { name: string; unit_price: number };
	printing: { name: string; unit_price: number };
	backing?: { name: string; unit_price: number };
	stretching?: { name: string; unit_price: number };
	sides?: { name: string; unit_price: number };
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
};

type TFrameType =
	| typeof UPLOAD_AND_FRAME_PRINT_ONLY
	| typeof UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT
	| typeof UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING
	| typeof UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING;

function Page({ searchParams }: { searchParams: Promise<TSearchParams> }) {
	const sP = use(searchParams);
	const { frameId, frameType: _fT } = sP;
	const frameType: TFrameType = [
		UPLOAD_AND_FRAME_PRINT_ONLY,
		UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
		UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING,
		UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING,
	].includes(_fT || "")
		? (_fT as TFrameType)
		: UPLOAD_AND_FRAME_PRINT_ONLY;
	const { retrieveObject, storedObject, initialized } = useIndexedDBObjectStorage();

	const croppedImage = storedObject?.isExt ? storedObject.src : storedObject?.image || getImagePlaceholder();
	const width = storedObject?.width || 12;
	const height = storedObject?.height || 9;

	useEffect(() => {
		if (initialized) {
			retrieveObject(INDEXED_DB_UAF_DATA_KEY)
				.then((res) => {
					if (!res) {
						toast.error("Select an image to customize before proceeding");
						redirect("/");
					}
				})
				.catch((e) => {
					console.log(e);
					toast.error("Select an image to customize before proceeding");
					redirect("/");
				});
		}
	}, [initialized, retrieveObject]);

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

	const [upload, setUpload] = useState<uploadOptionsProps>({
		dimensions: { width: 0, height: 0 },
		printing: {
			name: "",
			unit_price: 0,
		},
		glazing: _optionsKey.includes("glazing") ? { name: "", unit_price: 0 } : undefined,
		backing: _optionsKey.includes("backing") ? { name: "", unit_price: 0 } : undefined,
		stretching: _optionsKey.includes("stretching") ? { name: "", unit_price: 0 } : undefined,
		sides: _optionsKey.includes("sides") ? { name: "", unit_price: 0 } : undefined,
	});

	const [frames, fLoading] = useFrames(
		!(frameType === UPLOAD_AND_FRAME_PRINT_ONLY || frameType === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT),
	);
	const { customizingFrame, setCustomizingFrame, selectVariant, selectedvariant, selectedvariantInd } =
		useCustomizingFrame(frames, frameId);
	const [mat, setMat] = useState<matOptionsProps>([{ width: 0.75, color: "#ffffff", id: "1" }]);

	const [addingToCart, setAddingToCart] = useState(false);

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

	useEffect(() => {
		if (!content.mat && mat.length > 0) {
			setMat([]);
		}
	}, [content.mat, mat.length]);

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

	const price =
		unstable_calculateTotalPrice({
			frame: selectedvariant,
			height: totalSize.height,
			width: totalSize.width,
			glazingRate: upload.glazing?.unit_price || 0,
			printingRate: upload.printing.unit_price,
			backingRate: upload.backing?.unit_price || 0,
			stretchingRate: upload.stretching?.unit_price || 0,
			sidesRate: upload.sides?.unit_price || 0,
		}) / 100;

	const addToCart = (qty: number) => {
		if (!upload.glazing?.name && customizeOptions === UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING) {
			toast.error("Please select a glazing option");
			return;
		}
		if (!upload.printing?.name) {
			toast.error("Please select a printing option");
			return;
		}
		if (!upload.backing?.name && customizeOptions === UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING) {
			toast.error("Please select a backing option");
			return;
		}
		if (
			!upload.stretching?.name &&
			(customizeOptions === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT ||
				customizeOptions === UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING)
		) {
			toast.error("Please select a stretching option");
			return;
		}
		if (!upload.sides?.name && customizeOptions === UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT) {
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
					image={{ src: croppedImage, ...upload.dimensions }}
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
					<h1 className="leading-auto text-xl font-semibold md:text-3xl">{content.title}</h1>
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
									<InputField
										key={customizeOptions}
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
