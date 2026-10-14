"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthSession } from "@/features/auth/public";
import { FeedbackModal } from "@/features/feedback/public";
import { DesktopFooter } from "@/features/home/components/DesktopFooter";
import { FloatingBar } from "@/features/home/components/FloatingBar";
import { HomeContent } from "@/features/home/components/HomeContent";
import { HomeHeader } from "@/features/home/components/HomeHeader";
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

  const handleScrollToTop = () => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllServices = () => {
    router.push("/services");
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
        <HomeContent
          contentScrollRef={contentScrollRef}
          data={data}
          error={error}
          isHeaderCompact={isHeaderCompact}
          loading={loading}
          onRefresh={() => void refresh()}
          onScrollToTop={handleScrollToTop}
          onViewAllServices={handleViewAllServices}
        />

        <DesktopFooter isVisible={isDesktopFooterVisible} />

        <FloatingBar tiles={data?.floatingBarTiles} loading={loading} />
        <FeedbackModal />
      </div>
    </main>
  );
}
