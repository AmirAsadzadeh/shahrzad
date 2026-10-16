"use client";

import Image from "next/image";
import ReactDOM from "react-dom";
import { BannerCarouselSkeleton } from "@/features/home/components/BannerCarouselSkeleton";
import { FloatingBarSkeleton } from "@/features/home/components/FloatingBarSkeleton";
import { ServiceGridSkeleton } from "@/features/home/components/ServiceGridSkeleton";

export function HomePageSkeleton() {
  ReactDOM.preload("/assets/background-header-desktop.svg", {
    as: "image",
    type: "image/svg+xml",
    fetchPriority: "high",
  });

  return (
    <main
      aria-busy="true"
      aria-label="در حال بارگذاری صفحه شهرزاد"
      className="min-h-screen bg-white"
    >
      <div className="relative flex h-dvh flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="shahrzad-pattern pointer-events-none absolute inset-x-0 top-0 z-0 h-50 overflow-clip rounded-b-2xl md:hidden"
        />

        <header className="shahrzad-header-pattern relative z-10 h-50 shrink-0 overflow-visible text-white md:h-34 md:rounded-b-2xl md:px-6">
          <div className="relative z-30 mx-auto h-full w-full max-w-300 md:h-18.5">
            <div className="hidden h-17.5 items-center justify-between md:flex">
              <div className="relative h-14 w-24">
                <Image
                  src="/assets/logo.svg"
                  fill
                  fetchPriority="high"
                  sizes="96px"
                  alt="شهرزاد"
                />
              </div>
              <div className="flex flex-row-reverse items-center gap-5.5">
                <span className="shahrzad-wallet-surface h-12 w-12 border border-white/20" />
                <span className="shahrzad-wallet-surface h-12 w-41.5 border border-white/20 " />
              </div>
            </div>

            <div className="relative h-21 md:hidden">
              <span className="absolute right-5 top-7 h-6 w-6 rounded-full bg-white/10" />
              <div className="absolute left-1/2 top-6 h-8 w-24 -translate-x-1/2">
                <Image
                  src="/assets/logo.svg"
                  fill
                  fetchPriority="high"
                  sizes="96px"
                  alt="شهرزاد"
                />
              </div>
              <span className="absolute left-5 top-7 h-6 w-6 rounded bg-white/10" />
              <span className="absolute left-15 top-7 h-6 w-6 rounded-full bg-white/10" />
              <span className="shahrzad-wallet-surface absolute inset-x-5 top-21 h-12 border border-white/20" />
            </div>
          </div>
        </header>

        <div className="relative z-20 mx-4 -mt-12 min-h-0 flex-1 overflow-hidden rounded-t-[22px] bg-white px-3 pt-3 md:mx-0 md:rounded-none md:bg-transparent md:p-0">
          <section className="fit-width relative z-20 md:max-w-225 md:px-0">
            <div className="shahrzad-home-panel min-h-160 rounded-t-[22px] bg-white p-0 md:px-3 md:pb-14 md:pt-3">
              <div className="mb-7 rounded-xl bg-white md:mb-4">
                <BannerCarouselSkeleton />
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-4 w-24 rounded bg-shahrzad-surface-soft animate-shimmer" />
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="h-4 w-16 rounded bg-shahrzad-surface-soft animate-shimmer" />
              </div>
              <div className="grid grid-cols-4 justify-items-stretch gap-y-4 md:gap-x-12 md:gap-y-14 lg:gap-x-20">
                <ServiceGridSkeleton />
              </div>
            </div>
          </section>
        </div>

        <FloatingBarSkeleton />
      </div>
    </main>
  );
}
