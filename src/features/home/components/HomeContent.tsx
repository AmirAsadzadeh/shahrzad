"use client";

import { Alert, Button } from "antd";
import Image from "next/image";
import type { HomePayload } from "@/entities/home/model/types";
import { BannerCarousel } from "@/features/home/components/BannerCarousel";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";
import { BackToTopButton } from "@/shared/ui/BackToTopButton";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Props = {
  data?: HomePayload;
  error: unknown;
  loading: boolean;
  onRefresh: () => void;
  onScrollToTop: () => void;
  onViewAllServices: () => void;
};

export function HomeContent({
  data,
  error,
  loading,
  onRefresh,
  onScrollToTop,
  onViewAllServices,
}: Props) {
  return (
    <>
      <section className="fit-width relative z-20 md:-mt-12 md:max-w-225 md:px-0">
        <div className="shahrzad-home-panel min-h-160 rounded-t-[22px] bg-white p-0 md:px-3 md:pb-14 md:pt-3">
          <div className="mb-7 rounded-xl bg-white md:mb-4">
            <BannerCarousel
              banners={data?.banners}
              loading={loading}
              position="top"
            />
          </div>

          <SectionHeader
            action={{ label: "مشاهده همه", onClick: onViewAllServices }}
            headingLevel="h1"
            title="خدمات شهرزاد"
          />

          <HomeServices
            data={data}
            error={error}
            isLoading={loading}
            onRetry={onRefresh}
          />

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
    </>
  );
}

type HomeServicesProps = {
  data?: HomePayload;
  error: unknown;
  isLoading: boolean;
  onRetry: () => void;
};

function HomeServices({ data, error, isLoading, onRetry }: HomeServicesProps) {
  if (error && !data) {
    return <HomeServicesError onRetry={onRetry} />;
  }

  return (
    <>
      {error && <HomeServicesError onRetry={onRetry} />}
      <ServiceGrid isLoading={isLoading} tiles={data?.tiles ?? []} />
    </>
  );
}

function HomeServicesError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert
      type="error"
      showIcon
      title="خطا در بارگذاری اطلاعات"
      description="متاسفانه مشکلی در نمایش خدمات پیش آمده، لطفا دوباره تلاش کنید."
      action={<Button onClick={onRetry}>تلاش دوباره</Button>}
      className="mb-5"
    />
  );
}
