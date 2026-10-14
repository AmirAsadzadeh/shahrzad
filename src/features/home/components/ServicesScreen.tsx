"use client";

import { Input } from "antd";
import { SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/features/auth/public";
import { PageTitle } from "@/shared/ui/PublicShell";
import { ServiceTile } from "@/features/home/components/ServiceTile";
import { ServiceTileSkeleton } from "@/features/home/components/ServiceTileSkeleton";
import { useHomeData } from "@/features/home/hooks/useHomeData";

export function ServicesScreen() {
  const router = useRouter();
  const { authenticated, loading: sessionLoading } = useAuthSession();
  const { data, loading } = useHomeData(authenticated);
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
    <main className="min-h-screen bg-[#f2f6fb] p-5">
      <section className="fit-width">
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
        <div className="grid grid-cols-4 rounded-2xl bg-white p-4 tile-shadow md:grid-cols-6">
          {loading
            ? Array.from({ length: 18 }).map((_, index) => <ServiceTileSkeleton key={index} />)
            : tiles.map((tile) => <ServiceTile key={tile.id} tile={tile} />)}
        </div>
      </section>
    </main>
  );
}
