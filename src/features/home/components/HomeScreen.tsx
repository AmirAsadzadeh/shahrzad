"use client";

import { redirect, useRouter } from "next/navigation";
import { usePageScrollController } from "@/features/appShell/public";
import { SessionLoadError, useAuthSession } from "@/features/auth/public";
import { HomeContent } from "@/features/home/components/HomeContent";
import { HomePageLayout } from "@/features/home/components/HomePageLayout";
import { HomePageSkeleton } from "@/features/home/components/HomePageSkeleton";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { APP_ROUTES } from "@/shared/constants/routes";

export function HomeScreen() {
  const router = useRouter();
  const { authenticated, error: sessionError, loading: sessionLoading, refresh: refreshSession } = useAuthSession();
  const { data, loading, error, refresh: refreshHomeData } = useHomeData(authenticated);
  const { contentScrollRef, scrollToTop } = usePageScrollController();

  const handleViewAllServices = () => {
    router.push(APP_ROUTES.services);
  };

  if (sessionLoading) return <HomePageSkeleton />;
  if (sessionError) return <SessionLoadError onRetry={() => void refreshSession()} />;
  if (!authenticated) redirect(APP_ROUTES.loginToHome);

  return (
    <HomePageLayout
      contentScrollRef={contentScrollRef}
      isFloatingBarLoading={loading}
      isWalletLoading={loading}
    >
      <HomeContent
        data={data}
        error={error}
        loading={loading}
        onRetryServices={() => void refreshHomeData()}
        onScrollToTop={scrollToTop}
        onViewAllServices={handleViewAllServices}
      />
    </HomePageLayout>
  );
}
