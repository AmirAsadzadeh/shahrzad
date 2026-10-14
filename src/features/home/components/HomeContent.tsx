"use client";

import { Alert, Button } from "antd";
import Image from "next/image";
import type { RefObject } from "react";
import type { HomePayload } from "@/entities/home/model/types";
import { BannerCarousel } from "@/features/home/components/BannerCarousel";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";
import { BackToTopButton } from "@/shared/ui/BackToTopButton";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Props = {
  contentScrollRef: RefObject<HTMLDivElement | null>;
  data?: HomePayload;
  error: unknown;
  isHeaderCompact: boolean;
  loading: boolean;
  onRefresh: () => void;
  onScrollToTop: () => void;
  onViewAllServices: () => void;
};

export function HomeContent({
  contentScrollRef,
  data,
  error,
  isHeaderCompact,
  loading,
  onRefresh,
  onScrollToTop,
  onViewAllServices
}: Props) {
  return (
    <div
      ref={contentScrollRef}
      role="region"
      aria-label="محتوای صفحه اصلی"
      className={`relative z-20 mx-4 -mt-12 min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-t-[22px] bg-white px-3 pb-0 pt-3 scrollbar-none transition-transform duration-200 ease-in-out will-change-transform md:static md:mx-0 md:mt-0 md:block md:flex-none md:overflow-visible md:rounded-none md:bg-transparent md:p-0 md:transition-none ${
        isHeaderCompact ? "-mb-18.5 -translate-y-18.5" : ""
      }`}
    >
      <section className="fit-width relative z-20 md:-mt-12 md:max-w-225 md:px-0">
        <div className="shahrzad-home-panel min-h-160 rounded-t-[22px] bg-white p-0 md:px-3 md:pb-14 md:pt-3">
          <div className="mb-7 rounded-xl bg-white md:mb-4">
            <BannerCarousel banners={data?.banners} loading={loading} position="top" />
          </div>

          <SectionHeader
            action={{ label: "مشاهده همه", onClick: onViewAllServices }}
            headingLevel="h1"
            title="خدمات شهرزاد"
          />

          {Boolean(error) && (
            <Alert
              type="error"
              showIcon
              message="خطا در بارگذاری اطلاعات"
              description="متاسفانه مشکلی در نمایش خدمات پیش آمده، لطفا دوباره تلاش کنید."
              action={<Button onClick={onRefresh}>تلاش دوباره</Button>}
              className="mb-5"
            />
          )}

          <ServiceGrid isLoading={loading} tiles={data?.tiles ?? []} />

          <BackToTopButton onClick={onScrollToTop} />
        </div>
      </section>

      <div className="shahrzad-mobile-footer relative mt-9 h-60.5 overflow-hidden md:hidden">
        <Image
          src="/assets/footer-background.svg"
          width={375}
          height={232}
          sizes="100vw"
          alt=""
          unoptimized
          className="block h-auto w-full object-contain"
        />
      </div>

      <div aria-hidden="true" className="hidden h-69.5 md:block" />
    </div>
  );
}
