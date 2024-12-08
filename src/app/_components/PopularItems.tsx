"use server";
import React from "react";
import Link from "next/link";
import { getPopularFramesAction } from "@/serverActions/frames/frame.action";
import ItemsSwiper from "./ItemsSwiper";

async function PopularItems() {
	const popularFrames = await getPopularFramesAction()
		.then((data) => {
			if (data.success) {
				return data.data;
			} else {
				return [];
			}
		})
		.catch((error) => {
			console.log(error);
			return [];
		});
	if (popularFrames.length == 0) return <></>;

	return (
		<div className="mx-auto mt-5 w-11/12 max-w-screen-2xl items-center pt-5" id="explore">
			<div className="flex items-center justify-between font-semibold">
				<h2 className="text-2xl md:text-4xl">Popular Items</h2>
				<Link href="/frames" className="text-dark-blue hover:underline md:text-xl">
					See all
				</Link>
			</div>
			<ItemsSwiper popularFrames={popularFrames} />
		</div>
	);
}

export default PopularItems;
