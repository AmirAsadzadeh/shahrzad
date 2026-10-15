import { ArrowDown2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { HeaderAccountMenu } from "@/features/appShell/components/HeaderAccountMenu";
import { WalletAction } from "@/features/appShell/components/WalletAction";
import { APP_ROUTES } from "@/shared/constants/routes";

type Props = {
  isWalletLoading: boolean;
  showAccount: boolean;
  showWallet: boolean;
};

export function DesktopHeaderNavigation({
  isWalletLoading,
  showAccount,
  showWallet
}: Props) {
  return (
    <nav className="hidden h-17.5 items-center justify-between gap-6 text-sm font-bold md:flex">
      <div className="flex items-center gap-12">
        <Link href={APP_ROUTES.home} aria-label="صفحه اصلی شهرزاد">
          <span className="relative block h-14 w-24">
            <Image src="/assets/logo.svg" fill sizes="96px" alt="شهرزاد" />
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-2 text-white" href={APP_ROUTES.services}>
            خدمات شهرزاد
            <ArrowDown2 size={16} />
          </Link>
          <Link className="text-white" href={APP_ROUTES.faq}>
            سوالات متداول
          </Link>
          <Link className="text-white" href={APP_ROUTES.aboutShahrzad}>
            درباره شهرزاد
          </Link>
        </div>
      </div>

      <div className="flex flex-row-reverse items-center gap-5.5">
        {showAccount && <HeaderAccountMenu variant="desktop" />}
        {showWallet && <WalletAction isLoading={isWalletLoading} variant="desktop" />}
      </div>
    </nav>
  );
}
