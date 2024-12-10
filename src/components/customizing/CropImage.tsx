"use client";
import { Img as ReactImage } from "@/components/Img";
import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function getCroppedImg(imageSrc: string, crop: Area): Promise<string> {
	if (typeof window === "undefined") return Promise.reject(new Error("Window not available"));
	const image = new Image();
	image.src = imageSrc;
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = crop.width;
	canvas.height = crop.height;

	return new Promise((resolve, reject) => {
		image.onload = () => {
			ctx?.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
			resolve(canvas.toDataURL("image/jpeg"));
		};
		image.onerror = () => {
			reject(new Error("Some error occurred"));
		};
	});
}

function CropImage({
	image,
	isExt,
	setImage,
	onError,
}: {
	image: string;
	isExt?: boolean;
	setImage: (image: string, width: number, height: number) => void;
	onError: () => void;
}) {
	const [size, setSize] = useState({ width: 12, height: 9 });
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [aspect, setAspect] = useState<number | null>(null);

	const onCropComplete = useCallback((_croppedArea: Area, _croppedAreaPixels: Area) => {
		setCroppedAreaPixels(_croppedAreaPixels);
	}, []);

	const onProceed = useCallback(() => {
		(async () => {
			if (isExt) {
				setImage(image, size.width, size.height);
				return;
			} else if (croppedAreaPixels) {
				try {
					const croppedImage = await getCroppedImg(image, croppedAreaPixels);
					setImage(croppedImage, size.width, size.height);
				} catch (e) {
					console.error(e);
					alert("Failed to crop image");
				}
			}
		})();
	}, [setImage, croppedAreaPixels, isExt, image, size]);

	useEffect(() => {
		if (!isExt) return;
		if (typeof window === "undefined") return;
		const _image = new Image();
		_image.src = image;
		_image.onload = () => {
			setSize({ width: 12, height: (12 * _image.height) / _image.width });
			setAspect(_image.width / _image.height);
		};
		_image.onerror = (error) => {
			console.error(error);
			onError();
		};
	}, [isExt, image, onError]);

	function onCancel() {
		onError();
	}
	return (
		<div className="flex h-full w-full flex-col items-center justify-items-stretch">
			<div className="mb-4 flex gap-4 *:text-sm *:font-normal">
				<Label className="flex items-center gap-2 max-md:flex-col">
					Width
					<Input
						type="number"
						min={1}
						value={size.width}
						onChange={(e) => {
							if (aspect) {
								setSize((s) => ({
									...s,
									width: Number(e.target.value),
									height: Number(e.target.value) / aspect,
								}));
							} else {
								setSize((s) => ({ ...s, width: Number(e.target.value) }));
							}
						}}
						step={0.5}
						placeholder="12"
						className="no-buttons-input w-16"
					/>
				</Label>
				<Label className="flex items-center gap-2 max-md:flex-col">
					Height
					<Input
						type="number"
						min={1}
						value={size.height}
						onChange={(e) => {
							setSize((s) => ({ ...s, height: Number(e.target.value) }));
						}}
						disabled={isExt}
						step={0.5}
						placeholder="9"
						className="no-buttons-input w-16"
					/>
				</Label>
			</div>
			<div className="h-full w-full">
				<div className="relative mx-auto aspect-square w-full max-w-[42rem] md:aspect-video md:w-5/6">
					{isExt ? (
						<>
							<ReactImage src={image} className="h-full w-full object-contain" alt="image" />
						</>
					) : (
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={size.width / size.height}
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={onCropComplete}
							cropShape="rect"
						/>
					)}
				</div>
			</div>
			<div className="mt-3 flex gap-3">
				<Button variant={"outline"} onClick={onCancel} className="border-red-500 hover:bg-red-300">
					Cancel
				</Button>
				<Button variant={"secondary"} onClick={onProceed} className="bg-green-500 hover:bg-green-700">
					Proceed
				</Button>
			</div>
		</div>
	);
}

export default CropImage;
