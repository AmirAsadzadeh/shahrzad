"use client";

import { Alert, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthSession } from "@/features/auth/public";
import { FeedbackModal } from "@/features/feedback/public";
import { BannerCarousel } from "@/features/home/components/BannerCarousel";
import { FloatingBar } from "@/features/home/components/FloatingBar";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { ServiceTile } from "@/features/home/components/ServiceTile";
import { ServiceTileSkeleton } from "@/features/home/components/ServiceTileSkeleton";
import { useHomeData } from "@/features/home/hooks/useHomeData";

export function HomeScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, loading, error, refresh } = useHomeData(authenticated);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const contentScroller = contentScrollRef.current;
    const updateHeaderState = (scrollPosition: number) => {
      setIsHeaderCompact((wasCompact) => {
        const compactThreshold = mobileQuery.matches ? 60 : 180;
        const expandedThreshold = mobileQuery.matches ? 20 : 60;

        if (!wasCompact && scrollPosition >= compactThreshold) {
          return true;
        }

        if (wasCompact && scrollPosition <= expandedThreshold) {
          return false;
        }

        return wasCompact;
      });
    };
    const updateFromWindow = () => {
      if (!mobileQuery.matches) updateHeaderState(window.scrollY);
    };
    const updateFromContent = () => {
      if (mobileQuery.matches && contentScroller) {
        updateHeaderState(contentScroller.scrollTop);
        const remainingScroll = contentScroller.scrollHeight - contentScroller.clientHeight - contentScroller.scrollTop;
        setIsFooterVisible(remainingScroll <= 2);
      }
    };
    const handleViewportChange = () => {
      setIsHeaderCompact(false);
      updateFromWindow();
      updateFromContent();
    };

    updateFromWindow();
    updateFromContent();
    window.addEventListener("scroll", updateFromWindow, { passive: true });
    contentScroller?.addEventListener("scroll", updateFromContent, { passive: true });
    mobileQuery.addEventListener("change", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", updateFromWindow);
      contentScroller?.removeEventListener("scroll", updateFromContent);
      mobileQuery.removeEventListener("change", handleViewportChange);
    };
  }, [authenticated]);

  if (sessionLoading || !authenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative flex h-[100dvh] flex-col overflow-hidden md:block md:h-auto md:min-h-screen md:overflow-visible">
        <div
          aria-hidden="true"
          className={`shahrzad-pattern pointer-events-none absolute inset-x-0 top-0 z-0 h-[200px] overflow-clip rounded-b-2xl transition-transform duration-200 md:hidden ${
            isHeaderCompact ? "-translate-y-20" : ""
          }`}
        />
        <HomeHeader isCompact={isHeaderCompact} loading={loading} />
        <div
          ref={contentScrollRef}
          className={`relative z-20 mx-4 -mt-12 min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-t-[22px] bg-white px-3 pb-0 pt-3 scrollbar-none transition-transform duration-200 ease-in-out will-change-transform md:static md:mx-0 md:mt-0 md:block md:flex-none md:overflow-visible md:rounded-none md:bg-transparent md:p-0 md:transition-none ${
            isHeaderCompact ? "mb-[-74px] -translate-y-[74px]" : ""
          }`}
        >
          <section className="fit-width relative z-20 md:-mt-16 md:px-6">
            <div className="min-h-[640px] rounded-t-[22px] bg-white p-0 md:px-4 md:pb-14 md:pt-4">
              <div className="mb-7 rounded-xl bg-white md:mb-8">
                <BannerCarousel banners={data?.banners} loading={loading} position="top" />
              </div>

              <div className="mb-4 flex items-center gap-3 text-neutral-900 md:mb-8">
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
                className="mr-auto mt-4 flex h-10 items-center justify-center whitespace-nowrap rounded-xl border border-[#1c66c1] bg-white px-4 py-2 text-sm font-medium leading-5 text-[#1c66c1] md:mt-16"
              >
                بازگشت به بالا
              </button>
            </div>
          </section>

          <div aria-hidden="true" className="mt-9 h-[242px] md:hidden" />

          <footer className="relative -mx-7 mt-9 hidden w-[calc(100%+56px)] overflow-hidden bg-white pt-0 md:mx-0 md:mt-4 md:block md:w-auto md:pt-14">
            <div className="mx-auto flex max-w-4xl flex-col items-center px-0">
              <div className="relative aspect-[760/220] w-full max-w-none md:max-w-[760px]">
                <Image
                  src="https://web.shahrzadcity.ir/assets/footer-background-CI-D7Rh8.svg"
                  fill
                  sizes="(max-width: 767px) 100vw, 760px"
                  alt=""
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
            <div className="hidden bg-[#2f84df] text-white md:block">
              <nav className="fit-width flex h-24 items-center justify-center gap-16 text-sm font-bold">
                <Link href="/about-shahrzad" className="!text-white">
                  درباره شهرزاد
                </Link>
                <Link href="/privacy" className="!text-white">
                  قوانین سایت
                </Link>
                <Link href="https://shahrzadcity.ir/contact" className="!text-white">
                  تماس با ما
                </Link>
                <Link href="/faq" className="!text-white">
                  پرسش های متداول
                </Link>
                <Link href="https://shahrzadcity.ir/download-app" className="!text-white">
                  اپلیکیشن موبایل
                </Link>
              </nav>
            </div>
          </footer>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] h-[242px] overflow-hidden will-change-[transform,opacity] transition-transform duration-200 md:hidden"
          style={{ transform: `translateY(${isFooterVisible ? 0 : 242}px)` }}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 w-full overflow-y-visible">
            <Image
              src="https://web.shahrzadcity.ir/assets/footer-background-CI-D7Rh8.svg"
              width={375}
              height={232}
              sizes="100vw"
              alt=""
              unoptimized
              className="block h-auto w-full object-contain"
            />
          </div>
        </div>

        <FloatingBar tiles={data?.floatingBarTiles} loading={loading} />
        <FeedbackModal />
      </div>
    </main>
  );
}
