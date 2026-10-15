"use client";

import { Input } from "antd";
import { SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppPageLayout } from "@/features/appShell/public";
import { useAuthSession } from "@/features/auth/public";
import { ServicesGrid } from "@/features/home/components/ServicesGrid";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { PageTitle } from "@/shared/ui/PublicShell";

export function ServicesScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, error, loading, refresh } = useHomeData(authenticated);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!sessionLoading && !authenticated) router.replace("/login-register?redirectTo=/services");
  }, [authenticated, router, sessionLoading]);

  const tiles = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return data?.tiles ?? [];
    return (data?.tiles ?? []).filter((tile) => tile.title.includes(normalized));
  }, [data?.tiles, query]);

  if (sessionLoading || !authenticated) return null;

  return (
    <AppPageLayout contentAriaLabel="محتوای خدمات شهرزاد" showWallet={false}>
      <section className="fit-width relative z-20 md:-mt-12 md:max-w-225 md:px-0">
        <div className="shahrzad-home-panel min-h-160 rounded-t-[22px] bg-white p-3 md:px-3 md:pb-14 md:pt-3">
          <PageTitle title="خدمات شهرزاد" />
          <Input
            size="large"
            placeholder="جستجو در خدمات"
            aria-label="جستجو در خدمات"
            prefix={<SearchNormal1 size={20} />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mb-6"
          />
          <ServicesGrid
            error={error}
            isLoading={loading}
            onRetry={() => void refresh()}
            tiles={tiles}
          />
        </div>
      </section>
    </AppPageLayout>
  );
}
