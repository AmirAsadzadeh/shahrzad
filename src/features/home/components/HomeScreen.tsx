"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePageScrollController } from "@/features/appShell/public";
import { useAuthSession } from "@/features/auth/public";
import { HomeContent } from "@/features/home/components/HomeContent";
import { HomePageLayout } from "@/features/home/components/HomePageLayout";
import { useHomeData } from "@/features/home/hooks/useHomeData";

export function HomeScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, loading, error } = useHomeData(authenticated);
  const { contentScrollRef, scrollToTop } = usePageScrollController();

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
