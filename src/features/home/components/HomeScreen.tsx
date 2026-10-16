"use client";

import { redirect, useRouter } from "next/navigation";
import { usePageScrollController } from "@/features/appShell/public";
import { useAuthSession } from "@/features/auth/public";
import { HomeContent } from "@/features/home/components/HomeContent";
import { HomePageLayout } from "@/features/home/components/HomePageLayout";
import { HomePageSkeleton } from "@/features/home/components/HomePageSkeleton";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { APP_ROUTES } from "@/shared/constants/routes";

export function HomeScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, loading, error } = useHomeData(authenticated);
  const { contentScrollRef, scrollToTop } = usePageScrollController();

  const handleViewAllServices = () => {
    router.push(APP_ROUTES.services);
  };

  if (sessionLoading) return <HomePageSkeleton />;
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
        onScrollToTop={scrollToTop}
        onViewAllServices={handleViewAllServices}
      />
    </HomePageLayout>
  );
}
