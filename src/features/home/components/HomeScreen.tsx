"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppPageLayout, usePageScrollController } from "@/features/appShell/public";
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
  const { contentScrollRef, scrollToTop } = usePageScrollController();
  const { handleContentScroll, isHeaderCompact, isDesktopFooterVisible } = useHomeViewport({
    authenticated,
    contentScrollRef
  });

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
        onScrollToTop={scrollToTop}
        onViewAllServices={handleViewAllServices}
      />
    </AppPageLayout>
  );
}
