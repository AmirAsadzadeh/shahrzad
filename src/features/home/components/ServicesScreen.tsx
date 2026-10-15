"use client";

import { Input } from "antd";
import { SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NestedPageLayout } from "@/features/appShell/public";
import { useAuthSession } from "@/features/auth/public";
import { ServicesGrid } from "@/features/home/components/ServicesGrid";
import { useHomeData } from "@/features/home/hooks/useHomeData";

export function ServicesScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, error, loading } = useHomeData(authenticated);
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
