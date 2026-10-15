import { Button } from "antd";
import { ArrowRight2, Home2 } from "iconsax-react";
import Link from "next/link";
import { DesktopHeaderNavigation } from "@/features/appShell/components/DesktopHeaderNavigation";

type Props = {
  isWalletLoading?: boolean;
  onBack: () => void;
  showAccount?: boolean;
  showWallet?: boolean;
  title: string;
};

export function NestedPageHeader({
  isWalletLoading = false,
  onBack,
  showAccount = true,
  showWallet = true,
  title
}: Props) {
  return (
    <header className="shahrzad-header-pattern relative z-10 h-31.5 shrink-0 overflow-visible px-0 text-white md:static md:h-34 md:rounded-b-2xl md:px-6">
      <div className="relative z-30 mx-auto h-full w-full max-w-300 md:h-18.5">
        <DesktopHeaderNavigation
          isWalletLoading={isWalletLoading}
          showAccount={showAccount}
          showWallet={showWallet}
        />

        <div className="relative h-21 md:hidden">
          <Link
            href="/home"
            aria-label="صفحه اصلی"
            className="absolute left-5 top-7 z-10 flex h-7 w-7 items-center justify-center text-white"
          >
            <Home2 size={28} color="currentColor" />
          </Link>
          <h1 className="absolute inset-x-14 top-7 text-center text-base font-bold leading-7 text-white">
            {title}
          </h1>
          <Button
            type="text"
            aria-label="بازگشت"
            icon={<ArrowRight2 size={28} color="currentColor" />}
            onClick={onBack}
            className="absolute right-5 top-7 z-10 h-7! w-7! min-w-0! p-0! text-white!"
          />
        </div>
      </div>
    </header>
  );
}
