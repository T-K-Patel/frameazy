import React from "react";
import Item from "./Item";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import Link  from "next/link";

const PopularItems = ({onAdd, onRemove}) => {
  return (
    <div className="w-[89%] mx-auto" id="explore">
      <div className="flex justify-between items-center font-semibold">
        <h2 className="text-2xl md:text-4xl">Popular Items</h2>
        <Link href="/frames" className="md:text-xl text-dark-blue hover:underline">See all</Link>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
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

export default PopularItems;
