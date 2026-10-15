import { Notification } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { DesktopHeaderNavigation } from "@/features/appShell/components/DesktopHeaderNavigation";
import { HeaderAccountMenu } from "@/features/appShell/components/HeaderAccountMenu";
import { WalletAction } from "@/features/appShell/components/WalletAction";
import { APP_ROUTES } from "@/shared/constants/routes";
import { ScanBarcodeIcon } from "@/shared/ui/ScanBarcodeIcon";

type Props = {
  isCompact: boolean;
  isWalletLoading?: boolean;
  showAccount?: boolean;
  showWallet?: boolean;
};

export function HomePageHeader({
  isCompact,
  isWalletLoading = false,
  showAccount = true,
  showWallet = true,
}: Props) {
  return (
    <header
      className={`shahrzad-header-pattern shahrzad-header-transition relative z-10 shrink-0 overflow-visible px-0 text-white md:static md:h-34 md:overflow-visible md:rounded-b-2xl md:px-6 ${
        isCompact ? "h-31.5" : "h-50"
      }`}
    >
      <div className="relative z-30 mx-auto h-full w-full max-w-300 md:h-18.5">
        <DesktopHeaderNavigation
          isWalletLoading={isWalletLoading}
          showAccount={showAccount}
          showWallet={showWallet}
        />

        <div className="relative h-21 md:hidden">
          {showAccount && <HeaderAccountMenu variant="mobile" />}
          <Link
            href={APP_ROUTES.home}
            aria-label="صفحه اصلی شهرزاد"
            aria-hidden={isCompact}
            tabIndex={isCompact ? -1 : 0}
            className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 shahrzad-header-transition ${
              isCompact
                ? "h-4 w-12 scale-75 opacity-0"
                : "pointer-events-auto h-8 w-24 scale-100 opacity-100"
            }`}
          >
            <Image
              src="/assets/logo.svg"
              fill
              sizes="96px"
              alt="شهرزاد"
              className="object-contain"
            />
          </Link>
          <button
            type="button"
            disabled
            aria-hidden={isCompact}
            tabIndex={isCompact ? -1 : 0}
            className={`absolute left-5 top-7 z-10 flex h-6 w-6 items-center justify-center text-white shahrzad-header-transition ${
              isCompact
                ? "pointer-events-none -translate-y-1 opacity-0"
                : "opacity-100"
            }`}
            aria-label="اسکن"
          >
            <ScanBarcodeIcon size={24} color="#fff" />
          </button>
          <button
            type="button"
            disabled
            className={`absolute top-7 z-10 flex h-6 w-6 items-center justify-center text-white shahrzad-header-transition ${
              isCompact ? "left-5" : "left-15"
            }`}
            aria-label="اعلان ها"
          >
            <Notification size={24} color="#fff" />
          </button>
          {showWallet && (
            <WalletAction
              isCompact={isCompact}
              isLoading={isWalletLoading}
              variant="mobile"
            />
          )}
        </div>
      </div>
    </header>
  );
}
