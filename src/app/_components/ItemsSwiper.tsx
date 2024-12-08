"use client";

import React from "react";
import Item from "./Item";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
import { PopularFrameDataType } from "@/serverActions/frames/frame.action";

type Props = {
	popularFrames: PopularFrameDataType[];
};

function ItemsSwiper({ popularFrames }: Props) {
	return (
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
			{popularFrames.map((item, ind) => {
				return (
					<SwiperSlide key={`${item.id}${ind}`}>
						<Item item={item} isPopularItem={true} />
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}

export default ItemsSwiper;
