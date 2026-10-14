"use client";

import { Alert, Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthSession } from "@/features/auth/public";
import { FeedbackModal } from "@/features/feedback/public";
import { BannerCarousel } from "@/features/home/components/BannerCarousel";
import { DesktopFooter } from "@/features/home/components/DesktopFooter";
import { FloatingBar } from "@/features/home/components/FloatingBar";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { ServiceTile } from "@/features/home/components/ServiceTile";
import { ServiceTileSkeleton } from "@/features/home/components/ServiceTileSkeleton";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { useHomeViewport } from "@/features/home/hooks/useHomeViewport";

export function HomeScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, loading, error, refresh } = useHomeData(authenticated);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const { isHeaderCompact, isDesktopFooterVisible } = useHomeViewport({
    authenticated,
    contentScrollRef
  });

  const scrollToTop = () => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!sessionLoading && !authenticated) {
      router.replace("/login-register?redirectTo=/home");
    }
  }, [authenticated, router, sessionLoading]);

  if (sessionLoading || !authenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative flex h-dvh flex-col overflow-hidden md:block md:h-auto md:min-h-screen md:overflow-visible">
        <div
          aria-hidden="true"
          className={`shahrzad-pattern pointer-events-none absolute inset-x-0 top-0 z-0 h-50 overflow-clip rounded-b-2xl transition-transform duration-200 md:hidden ${
            isHeaderCompact ? "-translate-y-20" : ""
          }`}
        />
        <HomeHeader isCompact={isHeaderCompact} loading={loading} />
        <div
          ref={contentScrollRef}
          className={`relative z-20 mx-4 -mt-12 min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-t-[22px] bg-white px-3 pb-0 pt-3 scrollbar-none transition-transform duration-200 ease-in-out will-change-transform md:static md:mx-0 md:mt-0 md:block md:flex-none md:overflow-visible md:rounded-none md:bg-transparent md:p-0 md:transition-none ${
            isHeaderCompact ? "-mb-18.5 -translate-y-18.5" : ""
          }`}
        >
          <section className="fit-width relative z-20 md:-mt-12 md:max-w-225 md:px-0">
            <div className="shahrzad-home-panel min-h-160 rounded-t-[22px] bg-white p-0 md:px-3 md:pb-14 md:pt-3">
              <div className="mb-7 rounded-xl bg-white md:mb-4">
                <BannerCarousel banners={data?.banners} loading={loading} position="top" />
              </div>

              <div className="mb-4 flex items-center gap-3 text-neutral-900 md:mb-4">
                <h1 className="text-sm font-bold md:text-base">خدمات شهرزاد</h1>
                <span className="h-px flex-1 bg-neutral-200" />
                <Button
                  type="link"
                  className="!h-auto !px-0 !text-xs !font-medium md:!text-sm"
                  onClick={() => router.push("/services")}
                >
                  مشاهده همه
                </Button>
              </div>

              {error && (
                <Alert
                  type="error"
                  showIcon
                  message="خطا در بارگذاری اطلاعات"
                  description="متاسفانه مشکلی در نمایش خدمات پیش آمده، لطفا دوباره تلاش کنید."
                  action={<Button onClick={() => refresh()}>تلاش دوباره</Button>}
                  className="mb-5"
                />
              )}

              <div className={`grid grid-cols-4 justify-items-stretch gap-y-4 md:gap-x-12 lg:gap-x-20 ${loading ? "md:gap-y-12" : "md:gap-y-14"}`}>
                {loading
                  ? Array.from({ length: 24 }).map((_, index) => (
                      <ServiceTileSkeleton
                        key={index}
                        className={index >= 16 ? "md:hidden" : undefined}
                      />
                    ))
                  : data?.tiles.map((tile) => <ServiceTile key={tile.id} tile={tile} />)}
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="mr-auto mt-4 flex h-10 items-center justify-center whitespace-nowrap rounded-xl border border-shahrzad-action bg-white px-4 py-2 text-sm font-medium leading-5 text-shahrzad-action md:mt-16"
              >
                بازگشت به بالا
              </button>
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

        <DesktopFooter isVisible={isDesktopFooterVisible} />

        <FloatingBar tiles={data?.floatingBarTiles} loading={loading} />
        <FeedbackModal />
      </div>
    </main>
  );
}
