"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AppPageLayout } from "@/features/appShell/public";
import { useAuthSession } from "@/features/auth/public";
import { FeedbackModal } from "@/features/feedback/public";
import { DesktopFooter } from "@/features/home/components/DesktopFooter";
import { FloatingBar } from "@/features/home/components/FloatingBar";
import { HomeContent } from "@/features/home/components/HomeContent";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { useHomeViewport } from "@/features/home/hooks/useHomeViewport";

export function HomeScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, loading, error, refresh } = useHomeData(authenticated);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const { handleContentScroll, isHeaderCompact, isDesktopFooterVisible } = useHomeViewport({
    authenticated,
    contentScrollRef
  });

  const handleScrollToTop = () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile && contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior });
      return;
    }

    window.scrollTo({ top: 0, behavior });
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
    <AppPageLayout
      contentAriaLabel="محتوای صفحه اصلی"
      contentScrollRef={contentScrollRef}
      footer={<DesktopFooter isVisible={isDesktopFooterVisible} />}
      headerMode="collapsible"
      isHeaderCompact={isHeaderCompact}
      isWalletLoading={loading}
      onContentScroll={handleContentScroll}
      overlays={
        <>
          <FloatingBar tiles={data?.floatingBarTiles} loading={loading} />
          <FeedbackModal />
        </>
      }
    >
      <HomeContent
        data={data}
        error={error}
        loading={loading}
        onRefresh={() => void refresh()}
        onScrollToTop={handleScrollToTop}
        onViewAllServices={handleViewAllServices}
      />
    </AppPageLayout>
  );
}
