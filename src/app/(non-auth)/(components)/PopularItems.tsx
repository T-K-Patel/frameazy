import React from "react";
import Item from "./Item";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay, Keyboard, Lazy } from "swiper/modules";
import Link from "next/link";

const PopularItems = () => {
    return (
        <div className="mx-auto w-11/12 max-w-screen-2xl items-center" id="explore">
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
                        spaceBetween: 20,
                    },
                    800: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                }}
                className="mt-10 md:pl-20 lg:pl-10"
            >
                <SwiperSlide>
                    <Item />
                </SwiperSlide>
                <SwiperSlide>
                    <Item />
                </SwiperSlide>
                <SwiperSlide>
                    <Item />
                </SwiperSlide>
                <SwiperSlide>
                    <Item />
                </SwiperSlide>
                <SwiperSlide>
                    <Item />
                </SwiperSlide>
                <SwiperSlide>
                    <Item />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default PopularItems
