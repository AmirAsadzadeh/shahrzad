import Link from "next/link";
import { APP_ROUTES } from "@/shared/constants/routes";
import { ScanBarcodeIcon } from "@/shared/ui/ScanBarcodeIcon";

const FLOATING_BAR_SKELETON_ITEM_COUNT = 2;

export function FloatingBarSkeleton() {
  return (
    <nav
      aria-label="دسترسی سریع"
      className="shahrzad-floating-bar fixed inset-x-0 bottom-0 z-2000 mx-auto h-23 w-full max-w-225 px-6 pb-5 pt-6 md:hidden"
    >
      <div className="shahrzad-floating-bar__surface relative mx-auto flex h-12 max-w-144 items-center justify-around bg-white p-3">
        {Array.from({ length: FLOATING_BAR_SKELETON_ITEM_COUNT }, (_, index) => (
          <div
            key={`floating-bar-skeleton-${index}`}
            className="flex items-center justify-center gap-1"
          >
            <span
              aria-hidden="true"
              className="h-6 w-6 shrink-0 rounded-lg bg-shahrzad-surface-soft animate-shimmer"
            />
            <span
              aria-hidden="true"
              className="h-3 w-14 rounded bg-shahrzad-surface-soft animate-shimmer"
            />
          </div>
        ))}
        <Link
          href={APP_ROUTES.qrPayment}
          aria-label="پرداخت با بارکد"
          className="shahrzad-floating-bar__center absolute left-1/2 top-1/2 flex h-17.5 w-17.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ backgroundColor: "#eaf2fc", color: "#307fe2" }}
        >
          <ScanBarcodeIcon size={32} color="#307fe2" />
        </Link>
      </div>
    </nav>
  );
}
