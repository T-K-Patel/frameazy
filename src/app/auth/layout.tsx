"use client";
import React from "react";
import AuthImage from "@/assets/frame-sign.png";
import Image from "next/image";

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid h-screen grid-cols-1 md:grid-cols-2">
			<div className="h-screen w-full pb-4">{children}</div>
			<div className="relative max-md:hidden">
				{/* <Img
					src={AuthImage.src}
					alt="Auth Image"
					loader={<Img src={getImagePlaceholder()} className="h-screen w-full object-cover" />}
					className="h-screen w-full object-cover"
				/> */}
				<Image
					src={AuthImage.src}
					alt="Auth Image"
					// loader={<Img src={getImagePlaceholder()} className="h-screen w-full object-cover" />}
					blurDataURL={AuthImage.blurDataURL}
					quality={100}
					priority={true}
					loading="eager"
					fill={true}
					placeholder="blur"
					className="h-screen w-full object-cover"
				/>
			</div>
		</div>
	);
}

export default Layout;
