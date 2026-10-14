"use client";

import { Button } from "antd";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled application error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-shahrzad-background px-6 text-center">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-xl font-black text-neutral-900">مشکلی پیش آمد</h1>
        <p className="mb-6 text-sm leading-7 text-neutral-600">بارگذاری این بخش با مشکل روبه‌رو شد. دوباره تلاش کنید.</p>
        <Button type="primary" onClick={reset}>
          تلاش دوباره
        </Button>
      </section>
    </main>
  );
}
