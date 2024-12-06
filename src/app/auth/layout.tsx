"use client";
import React from "react";
import AuthImage from "@/assets/frame-sign.png";
import { getImagePlaceholder } from "@/components/imagePlaceholder";
import { Img } from "react-image";

const layout = async ({ children }: { children: React.ReactNode }) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return (
		<div className="grid h-screen grid-cols-1 md:grid-cols-2">
			<div className="h-screen w-full pb-4">{children}</div>
			<div className="max-md:hidden">
				<Img
					src={AuthImage.src}
					alt="Auth Image"
					loader={<Img src={getImagePlaceholder()} className="h-screen w-full object-cover" />}
					className="h-screen w-full object-cover"
				/>
			</div>
		</div>
	);
};

export default layout;
