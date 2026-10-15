"use client";

import type { ReactNode, RefObject, UIEventHandler } from "react";
import { AppHeader } from "@/features/appShell/components/AppHeader";

type BaseProps = {
  children: ReactNode;
  contentAriaLabel: string;
  contentScrollRef?: RefObject<HTMLDivElement | null>;
  footer?: ReactNode;
  isWalletLoading?: boolean;
  overlays?: ReactNode;
  showAccount?: boolean;
  showWallet?: boolean;
};

type Props = BaseProps &
  (
    | {
        headerMode?: "compact";
        isHeaderCompact?: never;
        onContentScroll?: never;
      }
    | {
        headerMode: "collapsible";
        isHeaderCompact: boolean;
        onContentScroll: UIEventHandler<HTMLDivElement>;
      }
  );

export function AppPageLayout(props: Props) {
  const {
    children,
    contentAriaLabel,
    contentScrollRef,
    footer,
    isWalletLoading = false,
    overlays,
    showAccount = true,
    showWallet = true
  } = props;
  const isCollapsible = props.headerMode === "collapsible";
  const isHeaderCompact = isCollapsible ? props.isHeaderCompact : true;
  const handleContentScroll = isCollapsible ? props.onContentScroll : undefined;

  return (
    <main className="min-h-screen bg-white">
      <div className="relative flex h-dvh flex-col overflow-hidden md:block md:h-auto md:min-h-screen md:overflow-visible">
        <div
          aria-hidden="true"
          className={`shahrzad-pattern pointer-events-none absolute inset-x-0 top-0 z-0 h-50 overflow-clip rounded-b-2xl transition-transform duration-200 md:hidden ${
            isHeaderCompact ? "-translate-y-20" : ""
          }`}
        />
        <AppHeader
          isCompact={isHeaderCompact}
          isWalletLoading={isWalletLoading}
          showAccount={showAccount}
          showWallet={showWallet}
        />
        <div
          ref={contentScrollRef}
          onScroll={handleContentScroll}
          role="region"
          aria-label={contentAriaLabel}
          className="relative z-20 mx-4 -mt-12 min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-t-[22px] bg-white px-3 pb-0 pt-3 scrollbar-none md:static md:mx-0 md:mt-0 md:block md:flex-none md:overflow-visible md:rounded-none md:bg-transparent md:p-0"
        >
          {children}
        </div>
        {footer}
        {overlays}
      </div>
    </main>
  );
}
