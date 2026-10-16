"use client";

import { Input } from "antd";
import { SearchNormal1 } from "iconsax-react";
import { redirect } from "next/navigation";
import { useMemo, useState } from "react";
import { NestedPageLayout } from "@/features/appShell/public";
import { useAuthSession } from "@/features/auth/public";
import { ServicesGrid } from "@/features/home/components/ServicesGrid";
import { useHomeData } from "@/features/home/hooks/useHomeData";
import { APP_ROUTES } from "@/shared/constants/routes";

export function ServicesScreen() {
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, error, loading } = useHomeData(authenticated);
  const [query, setQuery] = useState("");

  const tiles = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return data?.tiles ?? [];
    return (data?.tiles ?? []).filter((tile) => tile.title.includes(normalized));
  }, [data?.tiles, query]);

  if (sessionLoading) return null;
  if (!authenticated) redirect(APP_ROUTES.loginToServices);

  return (
    <NestedPageLayout
      contentAriaLabel="محتوای خدمات شهرزاد"
      title="خدمات شهرزاد"
    >
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
        tiles={tiles}
      />
    </NestedPageLayout>
  );
}
