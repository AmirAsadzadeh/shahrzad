import Image from "next/image";
import Link from "next/link";
import { FloatingBarSkeleton } from "@/features/home/components/FloatingBarSkeleton";
import { APP_ROUTES } from "@/shared/constants/routes";
import { ScanBarcodeIcon } from "@/shared/ui/ScanBarcodeIcon";

const floatingBarItems = [
  {
    id: "wallet",
    title: "کیف پول",
    href: APP_ROUTES.wallet,
    imageSrc: "https://static.shahrzadcity.ir/base/app_icon/6tmR8v6ZFB.png"
  },
  {
    id: "services",
    title: "خدمات",
    href: APP_ROUTES.services,
    imageSrc: "https://static.shahrzadcity.ir/base/app_icon/NCqyPU86u7.png"
  }
] as const;

type Props = {
  loading?: boolean;
};

export function FloatingBar({ loading }: Props) {
  if (loading) return <FloatingBarSkeleton />;

  return (
    <nav
      aria-label="دسترسی سریع"
      className="shahrzad-floating-bar fixed inset-x-0 bottom-0 z-2000 mx-auto h-23 w-full max-w-225 px-6 pb-5 pt-6 md:hidden"
    >
      <div className="shahrzad-floating-bar__surface relative mx-auto flex h-12 max-w-144 items-center justify-around bg-white p-3">
        {floatingBarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex h-6 items-center justify-center gap-1 text-sm font-normal leading-5.5 text-shahrzad-ink! transition-transform duration-200 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-shahrzad-primary"
          >
            <Image
              src={item.imageSrc}
              width={24}
              height={24}
              alt=""
              className="h-6 w-6 object-contain"
            />
            <span className="text-xs font-semibold leading-[18.86px]">{item.title}</span>
          </Link>
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
