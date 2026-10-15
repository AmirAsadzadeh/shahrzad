import { Spin } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import Link from "next/link";
import { APP_ROUTES } from "@/shared/constants/routes";

type Props = {
  isCompact?: boolean;
  isLoading: boolean;
  variant: "desktop" | "mobile";
};

export function WalletAction({
  isCompact = false,
  isLoading,
  variant
}: Props) {
  const className = getClassName(variant, isCompact);
  const content =
    variant === "desktop" ? (
      <DesktopContent isLoading={isLoading} />
    ) : (
      <MobileContent isLoading={isLoading} />
    );

  if (isLoading) {
    return (
      <div
        className={className}
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        {content}
        <span className="sr-only">در حال بارگذاری کیف پول</span>
      </div>
    );
  }

  return (
    <Link
      href={APP_ROUTES.wallet}
      className={`${className} transition hover:bg-white/20`}
    >
      {content}
    </Link>
  );
}

function getClassName(variant: Props["variant"], isCompact: boolean) {
  if (variant === "desktop") {
    return "shahrzad-desktop-wallet shahrzad-wallet-surface flex h-12 shrink-0 items-center justify-between border border-white/20 px-3 text-white";
  }

  return `shahrzad-wallet-surface shahrzad-header-transition absolute z-0 flex items-center justify-between border border-white/20 px-3 text-sm font-normal leading-5.5 text-white! ${
    isCompact
      ? "left-1/2 top-3.5 h-12 w-[calc(100%-104px)] -translate-x-1/2"
      : "inset-x-5 top-21 h-12"
  }`;
}

function DesktopContent({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      <div className="text-base font-medium leading-6">
        <span>کیف پول:</span>
      </div>
      {isLoading ? (
        <Spin size="small" />
      ) : (
        <div className="flex items-center justify-end px-2 text-xs font-normal leading-[18.86px]">
          <span className="flex items-center justify-end text-xs font-bold leading-[18.86px]">
            مشاهده
            <ArrowLeft2 size={20} />
          </span>
        </div>
      )}
    </>
  );
}

function MobileContent({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      <div className="text-xs font-normal leading-[18.86px]">
        <span>کیف پول</span>
      </div>
      {isLoading ? (
        <Spin size="small" />
      ) : (
        <div className="flex flex-1 items-center justify-end text-xs font-normal leading-[18.86px]">
          <span className="flex items-center justify-end text-xs font-bold leading-[18.86px]">
            مشاهده موجودی
            <ArrowLeft2 size={20} color="#fff" />
          </span>
        </div>
      )}
    </>
  );
}
