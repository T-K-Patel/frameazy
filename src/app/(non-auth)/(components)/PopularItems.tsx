import React, { useEffect, useState } from "react";
import Item, { FrameLoading } from "./Item";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import { PopularFrameDataType, getPopularFramesAction } from "@/serverActions/frames/frame.action";

const PopularItems = () => {
	const [popularFrames, setPopularFrames] = useState<PopularFrameDataType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		getPopularFramesAction()
			.then((data) => {
				if (data.success) {
					setPopularFrames(data.data);
					setError(null);
				} else {
					setError(data.error);
					setPopularFrames([]);
				}
			})
			.catch((error) => {
				console.log(error);
				setError("Something went wrong");
				setPopularFrames([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (error) return null;

	return (
		<div className="mx-auto mt-5 w-11/12 max-w-screen-2xl items-center" id="explore">
			<div className="flex items-center justify-between font-semibold">
				<h2 className="text-2xl md:text-4xl">Popular Items</h2>
				<Link href="/frames" className="text-dark-blue hover:underline md:text-xl">
					See all
				</Link>
			</div>
			<Swiper
				slidesPerView={1}
				spaceBetween={10}
				navigation={true}
				autoplay={{ delay: 3000 }}
				modules={[Navigation, Autoplay]}
				breakpoints={{
					640: {
						slidesPerView: 1,
						spaceBetween: 15,
					},
					800: {
						slidesPerView: 2,
						spaceBetween: 15,
					},
					1200: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					1400: {
						slidesPerView: 4,
						spaceBetween: 20,
					},
				}}
				className="mt-10 md:pl-20 lg:pl-10"
			>
				{loading
					? Array.from({ length: 6 }).map((_, ind) => {
							return (
								<React.Fragment key={ind}>
									<SwiperSlide>
										<FrameLoading />
									</SwiperSlide>
								</React.Fragment>
							);
						})
					: popularFrames.map((item, ind) => {
							return (
								<React.Fragment key={ind}>
									<SwiperSlide className="">
										<Item item={item} isPopularItem={true} />
									</SwiperSlide>
								</React.Fragment>
							);
						})}
			</Swiper>
		</div>
	);
};

export default PopularItems;
