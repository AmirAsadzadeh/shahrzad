"use client";

import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/entities/home/model/types";
import { BannerCarouselSkeleton } from "@/features/home/components/BannerCarouselSkeleton";
import { Carousel } from "@/shared/ui/Carousel";
import { safeAssetSrc, safeHref } from "@/shared/lib/url";

type Props = {
  banners?: Banner[];
  loading?: boolean;
};

export function BannerCarousel({ banners = [], loading }: Props) {
  if (loading) return <BannerCarouselSkeleton />;

  if (banners.length === 0) return null;

  return (
    <Carousel
      ariaLabel="بنرهای شهرزاد"
      breakpoints={{
        900: {
          slidesPerView: 2,
          spaceBetween: 24
        }
      }}
      loop
      slideClassName="h-auto"
    >
      {banners.map((banner) => (
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
