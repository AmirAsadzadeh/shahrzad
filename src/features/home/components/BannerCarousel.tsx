"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { Banner } from "@/entities/home/model/types";
import { safeAssetSrc, safeHref } from "@/shared/lib/url";

type Props = {
  banners?: Banner[];
  loading?: boolean;
  position?: Banner["position"];
};

export function BannerCarousel({ banners = [], loading, position }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleBanners = useMemo(() => {
    const filtered = position ? banners.filter((banner) => banner.position === position) : banners;
    return filtered.filter((banner) => Boolean(safeAssetSrc(banner.image)));
  }, [banners, position]);

  const selectedIndex = visibleBanners.length ? Math.min(activeIndex, visibleBanners.length - 1) : 0;

  const selectBanner = (index: number) => {
    setActiveIndex(index);
    if (window.matchMedia("(min-width: 768px)").matches) return;

    scrollRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };

  if (loading) {
    return (
      <div className="w-full overflow-visible rounded-xl pb-6">
        <div
          aria-hidden="true"
          className="relative h-[180px] w-full overflow-hidden rounded-xl bg-[#f7f7f7] animate-shimmer"
        />
      </div>
    );
  }

  if (visibleBanners.length === 0) return null;

  return (
    <section aria-label="بنرهای شهرزاد" className="animate-soft-in">
      <div ref={scrollRef} className="scrollbar-none flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
        {visibleBanners.map((banner) => (
          <a
            key={banner.id}
            href={safeHref(banner.url)}
            className="relative block aspect-[2.48] min-w-full snap-center overflow-hidden rounded-xl bg-white shadow-[0_8px_22px_rgba(34,87,143,0.08)] md:min-w-0"
          >
            <Image src={safeAssetSrc(banner.image) || "/assets/logo.svg"} alt={banner.name} fill className="object-cover" unoptimized />
          </a>
        ))}
      </div>
      {visibleBanners.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {visibleBanners.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`نمایش بنر ${index + 1}`}
              aria-pressed={index === selectedIndex}
              onClick={() => selectBanner(index)}
              className={`h-1 rounded-full transition-all ${index === selectedIndex ? "w-4 bg-[#307fe2]" : "w-2 bg-neutral-300"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
