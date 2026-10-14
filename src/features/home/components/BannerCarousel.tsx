"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Banner } from "@/entities/home/model/types";
import { Carousel } from "@/shared/ui/Carousel";
import { safeAssetSrc, safeHref } from "@/shared/lib/url";

type Props = {
  banners?: Banner[];
  loading?: boolean;
  position?: Banner["position"];
};

export function BannerCarousel({ banners = [], loading, position }: Props) {
  const visibleBanners = useMemo(() => {
    const filtered = position ? banners.filter((banner) => banner.position === position) : banners;
    return filtered.filter((banner) => Boolean(safeAssetSrc(banner.image)));
  }, [banners, position]);

  if (loading) {
    return (
      <div className="w-full overflow-visible rounded-xl pb-6">
        <div
          aria-hidden="true"
          className="relative h-45 w-full overflow-hidden rounded-xl bg-shahrzad-surface-soft animate-shimmer"
        />
      </div>
    );
  }

  if (visibleBanners.length === 0) return null;

  return (
    <Carousel
      ariaLabel="بنرهای شهرزاد"
      breakpoints={{
        900: {
          slidesPerView: 2,
          spaceBetween: 24
        }
      }}
      className="animate-soft-in"
      loop
      slideClassName="h-auto"
    >
      {visibleBanners.map((banner) => (
        <Link
          key={banner.id}
          href={safeHref(banner.url)}
          className="relative block aspect-[2.48] overflow-hidden rounded-xl bg-white shadow-[0_8px_22px_rgba(34,87,143,0.08)]"
        >
          <Image src={safeAssetSrc(banner.image) || "/assets/logo.svg"} alt={banner.name} fill className="object-cover" />
        </Link>
      ))}
    </Carousel>
  );
}
