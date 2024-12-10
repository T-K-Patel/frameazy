"use client";
import useIndexedDBObjectStorage from "@/app/customize/_hooks/useIndexedDBObjectStorage";
import Canvas from "@/assets/canvas.svg";
import Empty from "@/assets/empty.svg";
import Mirror from "@/assets/mirror.svg";
import Paper from "@/assets/paper.svg";
import Upload from "@/assets/uploadImage.svg";
import {
	EMPTY_FRAME_FOR_CANVAS_OR_PANEL,
	EMPTY_FRAME_FOR_PAPER_ITEMS,
	MIRROR_FRAME,
	UPLOAD_AND_FRAME_PRINT_ONLY,
	UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
	UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING,
	UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING,
} from "@/contants/customizations";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { BiArrowBack, BiRepeat } from "react-icons/bi";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CropImage from "./CropImage";
import UploadImage from "./UploadImage";

type FrameOptionProps = {
	title: string;
	image: StaticImageData;
	props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
};

const FrameOption = ({ title, image, ...props }: FrameOptionProps) => {
	return (
		<button className="h-full gap-4 rounded-2xl border-2 border-[#d0d0d0] p-4 md:p-6" {...props}>
			<p className="w-full pb-3 text-left font-bold">{title}</p>
			<Image
				src={image.src}
				width={200}
				height={200}
				alt="frame option"
				className="canvas h-auto w-auto object-contain"
				unoptimized
				style={{ position: "unset" }}
			/>
		</button>
	);
};

type ContentType = { title: string; desc: string; options?: FrameOptionProps[]; component?: ReactNode };
type TFrameType =
	| typeof UPLOAD_AND_FRAME_PRINT_ONLY
	| typeof UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT
	| typeof UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING
	| typeof UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING
	| typeof EMPTY_FRAME_FOR_CANVAS_OR_PANEL
	| typeof EMPTY_FRAME_FOR_PAPER_ITEMS
	| typeof MIRROR_FRAME;

type TFraming = {
	framingStyle: "none" | "uploadAndFrame" | "emptyFrame" | "mirrorFrame";
	data: {
		image?: string;
		croppedImage?: string;
		isExternal?: boolean;
		width?: number;
		height?: number;
		frameType?: TFrameType;
	};
};

type TCustimizationDialog = {
	frameId?: string;
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
};

const CustomizationDialog = ({ dialogOpen: isOpen, setDialogOpen: setIsOpen, frameId }: TCustimizationDialog) => {
	const router = useRouter();
	const [framing, setFrameOptions] = useState<TFraming>({
		framingStyle: "none",
		data: {},
	});

	const { storeObject } = useIndexedDBObjectStorage();

	const resetFrames = () => {
		setFrameOptions({ framingStyle: "none", data: {} });
	};
	const contentDivRef = useRef<HTMLDivElement>(null);

	const generateQuery = (obj: Record<string, string | number | boolean | undefined>) => {
		const query = new URLSearchParams();
		Object.entries(obj).forEach(([key, value]) => {
			if (value) query.append(key, value.toString());
		});
		return query.toString();
	};

	useEffect(() => {
		// on re-render, scroll content div to top
		contentDivRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, [framing]);

	const storeToIDB = () => {
		if (framing.data.isExternal) {
			return storeObject("uaf", {
				isExt: true,
				src: framing.data.image!,
				width: framing.data.width!,
				height: framing.data.height!,
			});
		} else {
			return storeObject("uaf", {
				isExt: false,
				width: framing.data.width!,
				height: framing.data.height!,
				image: framing.data.croppedImage!,
			});
		}
	};

	// Helper function for navigation and error handling
	async function navigateTo(
		route: string,
		query: Record<string, string | boolean | number | undefined>,
		closeModal = true,
	) {
		const queryString = generateQuery(query);
		await storeToIDB()
			.then(() => {
				router.push(`${route}?${queryString}`);
				if (closeModal) setIsOpen(false);
			})
			.catch((err) => {
				console.error(err);
				toast.error("Something went wrong, please try again later");
			});
	}

	// Helper function for updating frame options
	function updateFrameOptions(style: typeof framing.framingStyle, data: typeof framing.data = {}) {
		setFrameOptions((s) => ({ framingStyle: style, data: { ...s.data, ...data } }));
	}

	// Define content based on framingStyle
	const framingStyles = {
		none: {
			title: "Select your style of frame",
			desc: "Welcome to frame selection, choose the style that best suits your taste and needs",
			options: [
				{
					title: "Upload and frame an image",
					image: Upload,
					props: { onClick: () => updateFrameOptions("uploadAndFrame") },
				},
				{
					title: "Order Empty Frame",
					image: Empty,
					props: { onClick: () => updateFrameOptions("emptyFrame") },
				},
				{
					title: "Design a mirror",
					image: Mirror,
					props: {
						onClick: () => {
							const query = generateQuery({ frameId });
							router.push(`/customize/mirrorFrame?${query}`);
							setIsOpen(false);
						},
					},
				},
			],
		},
		emptyFrame: {
			title: "Please select the type of frame you want to create",
			desc: "Choose the type of empty frame you want to create",
			options: [
				{
					title: "Empty frame for canvas or panel",
					image: Canvas,
					props: {
						onClick: () =>
							navigateTo("/customize/emptyFrame", {
								frameType: EMPTY_FRAME_FOR_CANVAS_OR_PANEL,
								frameId,
							}),
					},
				},
				{
					title: "Empty frame for paper item",
					image: Paper,
					props: {
						onClick: () =>
							navigateTo("/customize/emptyFrame", { frameType: EMPTY_FRAME_FOR_PAPER_ITEMS, frameId }),
					},
				},
			],
		},
		uploadAndFrame: {
			default: {
				title: "Image of the subject",
				desc: "Please select the image file to be uploaded",
				component: (
					<UploadImage
						setImage={(img, isExt) =>
							updateFrameOptions("uploadAndFrame", { image: img, isExternal: isExt })
						}
					/>
				),
			},
			crop: {
				title: "Adjustment of image",
				desc: "What is the desired size of the printed image (inches)?",
				component: (
					<CropImage
						image={framing.data.image!}
						onError={() => updateFrameOptions("uploadAndFrame", { image: undefined })}
						setImage={(img, width, height) =>
							updateFrameOptions("uploadAndFrame", { croppedImage: img, width, height })
						}
						isExt={framing.data.isExternal}
					/>
				),
			},
			finalize: {
				title: "Type of frame",
				desc: "Please select the type of product you want to create.",
				options: [
					{
						title: "Print only",
						image: Upload,
						props: {
							onClick: () =>
								navigateTo("/customize/uploadAndFrame", {
									frameType: UPLOAD_AND_FRAME_PRINT_ONLY,
									w: framing.data.width,
								}),
						},
					},
					{
						title: "Stretched Canvas print",
						image: Upload,
						props: {
							onClick: () =>
								navigateTo("/customize/uploadAndFrame", {
									frameType: UPLOAD_AND_FRAME_STRECTCHED_CANVAS_PRINT,
									w: framing.data.width,
								}),
						},
					},
					{
						title: "Framed print without mat & glazing",
						image: Upload,
						props: {
							onClick: () =>
								navigateTo("/customize/uploadAndFrame", {
									frameType: UPLOAD_AND_FRAME_WITHOUT_MAT_AND_GLAZING,
									w: framing.data.width,
									frameId,
								}),
						},
					},
					{
						title: "Framed print with mat & glazing",
						image: Upload,
						props: {
							onClick: () =>
								navigateTo("/customize/uploadAndFrame", {
									frameType: UPLOAD_AND_FRAME_WITH_MAT_AND_GLAZING,
									w: framing.data.width,
									frameId,
								}),
						},
					},
				],
			},
		},
	};

	let content: ContentType = framingStyles.none;
	let onBack = () => {};

	// Determine content dynamically
	if (framing.framingStyle === "emptyFrame") {
		content = framingStyles.emptyFrame;
		onBack = () => updateFrameOptions("none");
	} else if (framing.framingStyle === "uploadAndFrame") {
		if (!framing.data.image) {
			content = framingStyles.uploadAndFrame.default;
			onBack = () => updateFrameOptions("none");
		} else if (!framing.data.croppedImage) {
			content = framingStyles.uploadAndFrame.crop;
			onBack = () => updateFrameOptions("uploadAndFrame", { image: undefined });
		} else {
			content = framingStyles.uploadAndFrame.finalize;
			onBack = () => updateFrameOptions("uploadAndFrame", { croppedImage: undefined });
		}
	}

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogContent
				className={cn(
					"flex max-h-[90%] min-h-[70%] w-5/6 max-w-screen-2xl flex-col px-5 max-md:w-11/12 md:max-h-[90%] md:px-10",
					framing.framingStyle != "none" && framing.framingStyle != "mirrorFrame"
						? "pb-6 md:pb-14"
						: "py-6 pt-10 md:py-14",
				)}
			>
				<DialogTitle className="sr-only">Customization Style Dialog</DialogTitle>
				{framing.framingStyle != "none" && framing.framingStyle != "mirrorFrame" && (
					<DialogHeader className="flex h-min flex-row gap-4 space-y-0 text-center">
						<Button
							size={"sm"}
							variant={"outline"}
							onClick={onBack}
							className="h-min w-min border border-black p-2 text-sm font-semibold transition-all duration-200 active:scale-90 md:text-xl"
						>
							<BiArrowBack />
							&nbsp;Back
						</Button>
						<Button
							size={"sm"}
							variant={"outline"}
							onClick={resetFrames}
							className="h-min w-min border border-black p-2 text-sm font-semibold transition-all duration-200 active:scale-90 md:text-xl"
						>
							<BiRepeat />
							&nbsp;Reset
						</Button>
					</DialogHeader>
				)}
				<div
					ref={contentDivRef}
					className="flex h-auto w-auto flex-col items-center justify-start gap-y-5 overflow-y-auto md:gap-y-6"
				>
					<div className="h-auto w-auto items-center gap-y-4">
						<h1 className="leading-12 text-center text-xl font-semibold md:text-3xl">{content.title}</h1>
						<p className="text-center text-sm md:text-xl md:leading-[30px]">{content.desc}</p>
					</div>
					<div
						className={cn(
							"grid items-center justify-center gap-3 gap-y-3 max-md:!grid-cols-1 max-md:flex-col md:gap-5",
							framing.framingStyle == "uploadAndFrame" && framing.data.image && !framing.data.croppedImage
								? "w-full place-items-center"
								: "",
						)}
						style={{
							gridTemplateColumns: `repeat(${content.component ? 1 : content.options?.length == 4 ? 2 : content.options?.length || 3},1fr)`,
						}}
					>
						{content.component ??
							content.options?.map((option, index) => (
								<FrameOption key={index} title={option.title} image={option.image} {...option.props} />
							))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CustomizationDialog;
