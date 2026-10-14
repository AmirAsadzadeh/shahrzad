import { ScanBarcode } from "iconsax-react";
import Image from "next/image";
import type { ServiceTile } from "@/entities/home/model/types";
import { safeAssetSrc, safeHref } from "@/shared/lib/url";

export function FloatingBar({ tiles = [], loading }: { tiles?: ServiceTile[]; loading?: boolean }) {
  if (loading) {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-[2000] w-full px-6 pb-4 pt-6 md:hidden" style={{ background: "linear-gradient(180deg, transparent 0%, #fff 100%)" }}>
        <div className="relative mx-auto flex h-12 max-w-[343px] items-center justify-around gap-8 rounded-2xl bg-white p-2 shadow-[0_8px_12px_rgba(0,0,0,0.2)]">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center gap-1">
              <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded-lg bg-[#f7f7f7] animate-shimmer" />
              <span aria-hidden="true" className="h-3 w-14 rounded bg-[#f7f7f7] animate-shimmer" />
            </div>
          ))}
          <a
            href="/qr-payment"
            aria-label="پرداخت با بارکد"
            className="absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[20px] border-2 border-white"
            style={{ backgroundColor: "#eaf2fc", color: "#307fe2" }}
          >
            <ScanBarcode size={32} variant="Bulk" />
          </a>
        </div>
      </nav>
    );
  }

  const visibleTiles = tiles.slice(0, 2).reverse();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[2000] h-[92px] md:hidden">
      <div className="relative mx-auto mt-6 flex h-12 max-w-[343px] items-center justify-between rounded-[40px] bg-white px-10 shadow-[0_8px_12px_rgba(0,0,0,0.2)]">
        {visibleTiles.map((tile) => (
          <a key={tile.id} href={safeHref(tile.url)} className="flex h-6 items-center gap-1 text-xs font-semibold text-[#1c1c1c] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#307fe2]">
            {tile.title === "کیف پول" || tile.title === "خدمات" ? (
              <Image
                src={safeAssetSrc(tile.title === "کیف پول"
                  ? "https://static.shahrzadcity.ir/base/app_icon/6tmR8v6ZFB.png"
                  : "https://static.shahrzadcity.ir/base/app_icon/NCqyPU86u7.png") || "/assets/logo.svg"}
                width={24}
                height={24}
                alt=""
                unoptimized
                className="h-6 w-6 object-contain"
              />
            ) : null}
            <span>{tile.title}</span>
          </a>
        ))}
        <a
          href="/qr-payment"
          aria-label="پرداخت با بارکد"
          className="absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ backgroundColor: "#eaf2fc", color: "#307fe2" }}
        >
          <ScanBarcode size={32} variant="Bulk" />
        </a>
      </div>
    </nav>
  );
}
