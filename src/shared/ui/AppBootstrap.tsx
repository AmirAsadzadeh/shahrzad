"use client";

import Image from "next/image";

export function AppBootstrapLoader() {
  return (
    <main
      aria-busy="true"
      aria-label="در حال آماده‌سازی شهرزاد"
      className="flex min-h-dvh flex-col items-center justify-center bg-shahrzad-primary px-6"
    >
      <div className="shahrzad-bootstrap-logo relative h-14 w-40">
        <Image src="/assets/logo.svg" alt="شهرزاد" fill preload sizes="160px" />
      </div>
      <div aria-hidden="true" className="mt-6 flex items-center gap-2">
        <span className="shahrzad-bootstrap-dot" />
        <span className="shahrzad-bootstrap-dot" />
        <span className="shahrzad-bootstrap-dot" />
      </div>
      <span className="sr-only">در حال آماده‌سازی برنامه</span>
    </main>
  );
}

export function AppBootstrapError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-shahrzad-primary px-6 text-center text-white">
      <div className="relative mb-8 h-12 w-36">
        <Image src="/assets/logo.svg" alt="شهرزاد" fill preload sizes="144px" />
      </div>
      <h1 className="text-lg font-bold">راه‌اندازی شهرزاد انجام نشد</h1>
      <p className="mt-2 text-sm leading-7 text-white/80">لطفا اتصال خود را بررسی و دوباره تلاش کنید.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 h-10 rounded-xl border border-white bg-white px-5 text-sm font-bold text-shahrzad-primary outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-shahrzad-primary"
      >
        تلاش دوباره
      </button>
    </main>
  );
}
