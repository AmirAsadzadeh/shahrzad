"use client";

import { Children, useMemo, useRef, useState, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay } from "swiper/modules";
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
  stopOnLastSlide: false
};

function getMaximumSlidesPerView(
  slidesPerView: SwiperOptions["slidesPerView"],
  breakpoints: SwiperOptions["breakpoints"]
) {
  const breakpointSlidesPerView = Object.values(breakpoints ?? {}).map((breakpoint) => breakpoint.slidesPerView);
  const numericValues = [slidesPerView, ...breakpointSlidesPerView].filter(
    (value): value is number => typeof value === "number"
  );

  return Math.max(1, ...numericValues.map((value) => Math.ceil(value)));
}

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
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const maximumSlidesPerView = getMaximumSlidesPerView(slidesPerView, breakpoints);
  const visibleActiveIndex = Math.min(activeIndex, Math.max(slides.length - 1, 0));
  const renderedSlides = useMemo(() => {
    const renderedSlideCount = loop ? Math.max(slides.length, maximumSlidesPerView + 1) : slides.length;

    return Array.from({ length: renderedSlideCount }, (_, index) => ({
      content: slides[index % slides.length],
      index
    }));
  }, [loop, maximumSlidesPerView, slides]);

  if (slides.length === 0) return null;

  const updateActiveIndex = (swiper: SwiperInstance) => {
    setActiveIndex(swiper.realIndex % slides.length);
  };

  const selectSlide = (index: number) => {
    if (!swiperRef.current || swiperRef.current.destroyed) return;

    if (loop) {
      swiperRef.current.slideToLoop(index);
      return;
    }

    swiperRef.current.slideTo(index);
  };

  return (
    <section
      aria-label={ariaLabel}
      className={["shahrzad-carousel", className].filter(Boolean).join(" ")}
    >
      <Swiper
        a11y={{
          enabled: true,
          paginationBulletMessage: "نمایش اسلاید {{index}}"
        }}
        autoplay={autoplay}
        breakpoints={breakpoints}
        dir="rtl"
        loop={loop}
        modules={[A11y, Autoplay]}
        onRealIndexChange={updateActiveIndex}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateActiveIndex(swiper);
        }}
        pagination={false}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
      >
        {renderedSlides.map(({ content, index }) => (
          <SwiperSlide key={index} className={slideClassName}>
            {content}
          </SwiperSlide>
        ))}
      </Swiper>
      {pagination && slides.length > 1 && (
        <div className="shahrzad-carousel-pagination" role="group" aria-label={`${ariaLabel} صفحه‌بندی`}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-current={visibleActiveIndex === index ? "true" : undefined}
              aria-label={`نمایش اسلاید ${index + 1}`}
              className={`shahrzad-carousel-pagination__bullet${visibleActiveIndex === index ? " is-active" : ""}`}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
