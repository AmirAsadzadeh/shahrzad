import Image from "next/image";
import type { ServiceTile } from "@/entities/home/model/types";
import { safeAssetSrc, safeHref } from "@/shared/lib/url";
import { ScanBarcodeIcon } from "@/shared/ui/ScanBarcodeIcon";

export function FloatingBar({ tiles = [], loading }: { tiles?: ServiceTile[]; loading?: boolean }) {
  if (loading) {
    return (
      <nav className="shahrzad-floating-bar fixed inset-x-0 bottom-0 z-2000 mx-auto h-23 w-full max-w-225 px-6 pb-5 pt-6 md:hidden">
        <div className="shahrzad-floating-bar__surface relative mx-auto flex h-12 max-w-144 items-center justify-around bg-white p-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center gap-1">
              <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded-lg bg-shahrzad-surface-soft animate-shimmer" />
              <span aria-hidden="true" className="h-3 w-14 rounded bg-shahrzad-surface-soft animate-shimmer" />
            </div>
          ))}
          <a
            href="/qr-payment"
            aria-label="پرداخت با بارکد"
            className="shahrzad-floating-bar__center absolute left-1/2 top-1/2 flex h-17.5 w-17.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ backgroundColor: "#eaf2fc", color: "#307fe2" }}
          >
            <ScanBarcodeIcon size={32} color="#307fe2" />
          </a>
        </div>
      </nav>
    );
  }

  const visibleTiles = tiles.slice(0, 2).reverse();

  return (
    <nav className="shahrzad-floating-bar fixed inset-x-0 bottom-0 z-2000 mx-auto h-23 w-full max-w-225 px-6 pb-5 pt-6 md:hidden">
      <div className="shahrzad-floating-bar__surface relative mx-auto flex h-12 max-w-144 items-center justify-around bg-white p-3">
        {visibleTiles.map((tile) => (
          <a key={tile.id} href={safeHref(tile.url)} className="flex h-6 items-center justify-center gap-1 text-sm font-normal leading-5.5 text-shahrzad-ink! transition-transform duration-200 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-shahrzad-primary">
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
            <span className="text-xs font-semibold leading-[18.86px]">{tile.title}</span>
          </a>
        ))}
        <a
          href="/qr-payment"
          aria-label="پرداخت با بارکد"
          className="shahrzad-floating-bar__center absolute left-1/2 top-1/2 flex h-17.5 w-17.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ backgroundColor: "#eaf2fc", color: "#307fe2" }}
        >
          <ScanBarcodeIcon size={32} color="#307fe2" />
        </a>
      </div>
    </nav>
  );
}
