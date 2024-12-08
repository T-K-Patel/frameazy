"use client";
import React, { ChangeEvent, DragEvent, useState } from "react";
import UploadIcon from "@/assets/upload.svg";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Img } from "@/components/Img";

function UploadImage() {
	const [error, setError] = useState(null as string | null);
	const { frameOptions, setFrameOptions } = {
		frameOptions: { framingStyle: "uploadAndFrame", data: {} },
		setFrameOptions: (options: { framingStyle: string; data: any }) => options,
	};
	const [imageURL, setImageURL] = useState<string | null>(null);

	React.useEffect(() => {
		setError(null);
	}, []);

	const setImage = ({ image }: { image: File }) => {
		if (frameOptions.framingStyle == "uploadAndFrame") {
			const reader = new FileReader();
			reader.onloadend = () => {
				const dataUrl = reader.result as string;
				setFrameOptions({
					...frameOptions,
					data: { ...frameOptions.data, image: dataUrl, usingExternalImage: false },
				});
			};
			reader.readAsDataURL(image);
		}
	};

	const handleDragOver = (e: any) => {
		e.preventDefault();
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		const newFile = e.dataTransfer.files[0];
		setImage({ image: newFile });
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newFile = e.target.files?.length ? e.target.files[0] : null;
		if (newFile) setImage({ image: newFile });
	};
	const useExternalImage = (formData: FormData) => {
		const url = formData.get("imageURL") as string;
		if (url) {
			if (frameOptions.framingStyle == "uploadAndFrame") {
				setFrameOptions({
					...frameOptions,
					data: {
						...frameOptions.data,
						image: url,
						usingExternalImage: true,
					},
				});
			}
		}
	};
	return (
		<div>
			<div onDragOver={handleDragOver} className="mb-3" onDrop={handleDrop}>
				<Label className="cursor-pointer">
					<Img src={UploadIcon.src} alt="Auth Image" className="w-[28rem]" />
					<Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
				</Label>
			</div>
			<hr />
			<form action={useExternalImage} className="mt-3">
				{" "}
				<Label className="cursor-pointer">
					<p className="mb-2 text-center">Or paste Freepik image URL</p>
					<Input
						type="url"
						name="imageURL"
						className="p-2"
						value={imageURL ?? ""}
						required
						onChange={(e) => {
							// const url = ;
							setImageURL(e.currentTarget.value);
							if (!e.currentTarget.value) {
								setError(null);
								return;
							}
							try {
								const url = new URL(e.currentTarget.value);
								if (url.hostname !== "img.freepik.com") {
									setError("Invalid URL");
									return;
								} else {
									setError(null);
								}
							} catch {
								setError("Invalid URL");
								return;
							}
						}}
						placeholder="https://img.freepik.com/premium-photo/trees-growing-forest_1048944-30368869.jpg?w=996"
					/>
				</Label>
				<Button variant="default" size="lg" disabled={!imageURL} className="mt-3 w-full">
					Use Image
				</Button>
			</form>
			{error && <p className="mt-3 text-center text-red-500">{error}</p>}
		</div>
	);
}

export default UploadImage;
