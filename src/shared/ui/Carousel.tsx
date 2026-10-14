"use client";

import { Children, type ReactNode } from "react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";

type Props = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  slideClassName?: string;
  slidesPerView?: SwiperOptions["slidesPerView"];
  spaceBetween?: SwiperOptions["spaceBetween"];
  breakpoints?: SwiperOptions["breakpoints"];
  autoplay?: SwiperOptions["autoplay"];
  loop?: boolean;
  pagination?: boolean;
};

const defaultAutoplay: NonNullable<SwiperOptions["autoplay"]> = {
  delay: 5000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  stopOnLastSlide: true
};

export function Carousel({
  children,
  ariaLabel,
  className,
  slideClassName,
  slidesPerView = 1,
  spaceBetween = 12,
  breakpoints,
  autoplay = defaultAutoplay,
  loop = false,
  pagination = true
}: Props) {
  const slides = Children.toArray(children);

  if (slides.length === 0) return null;

  return (
    <section aria-label={ariaLabel} className={className}>
      <Swiper
        a11y={{
          enabled: true,
          paginationBulletMessage: "نمایش اسلاید {{index}}"
        }}
        autoplay={autoplay}
        breakpoints={breakpoints}
        dir="rtl"
        loop={loop}
        modules={[A11y, Autoplay, Pagination]}
        pagination={pagination && slides.length > 1 ? { clickable: true } : undefined}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={slideClassName}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
