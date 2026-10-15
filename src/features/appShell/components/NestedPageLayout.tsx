"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { NestedPageHeading } from "@/features/appShell/components/NestedPageHeading";
import { NestedPageHeader } from "@/features/appShell/components/NestedPageHeader";
import { PageFrame } from "@/features/appShell/components/PageFrame";

type Props = {
  children: ReactNode;
  contentAriaLabel: string;
  footer?: ReactNode;
  isWalletLoading?: boolean;
  overlays?: ReactNode;
  showAccount?: boolean;
  showWallet?: boolean;
  title: string;
};

export function NestedPageLayout({
  children,
  contentAriaLabel,
  footer,
  isWalletLoading = false,
  overlays,
  showAccount = true,
  showWallet = true,
  title
}: Props) {
  const router = useRouter();
  const handleBack = () => router.back();

  return (
    <PageFrame
      contentAriaLabel={contentAriaLabel}
      footer={footer}
      header={(
        <NestedPageHeader
          isWalletLoading={isWalletLoading}
          onBack={handleBack}
          showAccount={showAccount}
          showWallet={showWallet}
          title={title}
        />
      )}
      isMobileBackdropRaised
      overlays={overlays}
    >
      <section className="fit-width relative z-20 md:-mt-12 md:max-w-225 md:px-0">
        <div className="shahrzad-home-panel min-h-160 rounded-t-[22px] bg-white p-3 md:px-3 md:pb-14 md:pt-3">
          <NestedPageHeading onBack={handleBack} title={title} />
          {children}
        </div>
      </section>
    </PageFrame>
  );
}
