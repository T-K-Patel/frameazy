"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, DragEventHandler, forwardRef, use, useActionState, useEffect, useState } from "react";
import Upload from "../../../assets/upload.svg";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { addProduct } from "@/serverActions/admin/admin.action";
import { Img } from "react-image";
import DropDown from "@/components/DropDown";
import { toast } from "react-toastify";

type UploadImageProps = {
	name: string;
};
const UploadImage = forwardRef<HTMLInputElement, { name: string }>(function UploadImage(
	{ name }: UploadImageProps,
	ref,
) {
	const [error, setError] = useState(null as string | null);
	const [file, setFile] = useState<File | null>(null);
	const [dataUrl, setDataUrl] = useState<{ src: string; width: number; height: number } | null>(null);

	const handleDragOver = (e: any) => {
		e.preventDefault();
	};

	const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		const newFile = e.dataTransfer.files[0];
		if (!newFile.type.startsWith("image/")) {
			setError("Only Images are allowed");
			return;
		}
		setFile(newFile);
		const reader = new FileReader();
		reader.onloadend = () => {
			const dataUrl = reader.result as string;
			const image = new Image();
			image.src = dataUrl;
			image.onload = () => {
				setDataUrl({ src: dataUrl, width: image.width, height: image.height });
			};
		};
		reader.readAsDataURL(newFile);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newFile = e.target.files?.length ? e.target.files[0] : null;
		if (newFile) {
			setFile(newFile);
			const reader = new FileReader();
			reader.onloadend = () => {
				const dataUrl = reader.result as string;
				const image = new Image();
				image.src = dataUrl;
				image.onload = () => {
					setDataUrl({ src: dataUrl, width: image.width, height: image.height });
				};
			};
			reader.readAsDataURL(newFile);
		} else {
			if (!file) setError("Invalid file");
		}
	};

	return (
		<div onDragOver={handleDragOver} onDrop={handleDrop}>
			<>
				<Label className="relative cursor-pointer">
					<Img
						src={dataUrl?.src ?? Upload.src}
						width={dataUrl ? dataUrl.width : Upload.width}
						height={dataUrl ? dataUrl.height : Upload.height}
						alt="Auth Image"
						className="mx-auto max-h-[20rem] w-full max-w-[28rem] object-contain"
					/>
					<input
						type="file"
						accept="image/*"
						ref={ref}
						name={name}
						className="hidden"
						onChange={handleFileChange}
					/>
					{file && (
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-center text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
							Click to Upload new Image
						</div>
					)}
				</Label>
				{error && <p className="mt-3 text-center text-red-500">{error}</p>}
			</>
		</div>
	);
});
const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button size={"lg"} className="h-auto w-full py-3 text-lg" disabled={pending}>
			{pending ? "Uploading" : "Upload"}
		</Button>
	);
};

type AdminDashboardProps = {
	searchParams: Promise<{
		frame: string;
	}>;
};

const AdminDashboard = ({ searchParams }: AdminDashboardProps) => {
	const { frame: customizingFrame } = use(searchParams);
	const formRef = React.useRef<HTMLFormElement>(null);
	const [state, action] = useActionState(addProduct, null);

	console.log(customizingFrame);

	const prodImgref = React.useRef<HTMLInputElement>(null);
	const borderImgref = React.useRef<HTMLInputElement>(null);

	const [dropdownOptions, setDropdownOptions] = useState({
		colors: [] as string[],
		categories: [] as string[],
		collections: [] as string[],
	});

	const [selectedValues, setSelectedValues] = useState({
		color: "",
		category: "",
		collection: "",
	});

	useEffect(() => {
		if (state?.success) {
			// Redirect to the product page
			formRef.current?.reset();
		}
	}, [state]);

	useEffect(() => {
		let fetching = true;

		const init = async () => {
			try {
				const response = await fetch("/api/options/frameOptions", {
					next: {
						revalidate: 600,
						tags: ["frameOptions"],
					},
				});
				const data = await response.json();
				if (response.ok) {
					if (fetching) {
						setDropdownOptions(data);
					}
				} else {
					toast.error(data?.error ?? "Failed to fetch filters");
				}
			} catch (error) {
				console.log(error);
				toast.error("Failed to fetch filters");
			}
		};

		init();

		return () => {
			fetching = false;
		};
	}, []);

	useEffect(() => {
		if (customizingFrame) {
			// TODO: fetch frame data.
		}
	}, [customizingFrame]);

	const handleSelectionChange = (key: string, value: string) => {
		setSelectedValues((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<section className="mx-auto flex max-w-screen-2xl justify-center">
			<div className="flex w-5/6 flex-col gap-y-8 py-6">
				<h1 className="text-3xl font-semibold">{customizingFrame ? "Edit" : "Add"} Frame</h1>
				{state?.success == false && <p className="mt-3 text-red-500">{state.error}</p>}
				<form action={action} ref={formRef} className="grid grid-cols-1 gap-10 md:grid-cols-2">
					<div className="flex flex-col gap-y-7">
						<div className="flex flex-col gap-y-4">
							<div className="flex flex-col gap-y-2">
								<Label className="text-lg font-semibold">Product Name</Label>
								<Input className="h-12" name="productName" placeholder="Wooden frame" />
							</div>
							<div className="flex flex-col gap-y-2">
								<Label className="text-lg font-semibold">Unit Price(₹)</Label>
								<Input
									className="relative h-12"
									name="unitPrice"
									placeholder="₹1,000,000"
									type="number"
								/>
							</div>
							<div className="grid grid-cols-1 justify-between gap-5">
								<div className="flex flex-col gap-y-1">
									<Label className="text-lg font-semibold">Frames Category</Label>
									<input type="hidden" name="productCategory" value={selectedValues.category} />
									<DropDown
										items={dropdownOptions.categories}
										value={selectedValues.category}
										onChange={(value: string) => handleSelectionChange("category", value)}
									/>
								</div>
								<div className="flex flex-col gap-y-1">
									<Label className="text-lg font-semibold">Frames Colors</Label>
									<input type="hidden" name="productColor" value={selectedValues.color} />
									<DropDown
										items={dropdownOptions.colors}
										value={selectedValues.color}
										onChange={(value: string) => handleSelectionChange("color", value)}
									/>
								</div>
								<div className="flex flex-col gap-y-1">
									<span className="text-lg font-semibold">Collections</span>
									<input type="hidden" name="productCollection" value={selectedValues.collection} />
									<DropDown
										items={dropdownOptions.collections}
										value={selectedValues.collection}
										onChange={(value: string) => handleSelectionChange("collection", value)}
									/>
								</div>
							</div>
							<div className="flex justify-between p-3">
								<span className="text-xl font-semibold">Border Thickness</span>
								<div className="flex items-center gap-x-4">
									<Input
										name="borderWidth"
										className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
										placeholder="0"
									/>
									<span className="font-semibold">In</span>
								</div>
							</div>
						</div>
						<div className="max-md:hidden">
							<SubmitButton />
						</div>
					</div>
					<div className="flex flex-col gap-y-3">
						<h1 className="text-2xl font-semibold">Product Attributes</h1>
						<div className="grid gap-5">
							<div className="flex flex-col gap-y-2">
								<Label className="text-xl font-semibold">Product Image</Label>
								<UploadImage ref={prodImgref} name="productImage" />
							</div>
							<div className="flex flex-col gap-y-2">
								<Label className="text-xl font-semibold">Border Image</Label>
								<Label className="text-sm font-semibold">(Use image of top border.)</Label>
								<UploadImage ref={borderImgref} name="borderImage" />
							</div>
						</div>
						<div className="md:hidden">
							<SubmitButton />
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};

export default AdminDashboard;
