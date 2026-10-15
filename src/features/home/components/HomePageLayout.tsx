"use client";

import dynamic from "next/dynamic";
import type { ReactNode, RefObject } from "react";
import { HomePageHeader, PageFrame } from "@/features/appShell/public";
import { DesktopFooter } from "@/features/home/components/DesktopFooter";
import { FloatingBar } from "@/features/home/components/FloatingBar";
import { useHomeViewport } from "@/features/home/hooks/useHomeViewport";

const FeedbackModal = dynamic(() =>
  import("@/features/feedback/public").then((module) => module.FeedbackModal)
);

type Props = {
  children: ReactNode;
  contentScrollRef: RefObject<HTMLDivElement | null>;
  isFloatingBarLoading: boolean;
  isWalletLoading?: boolean;
};

export function HomePageLayout({
  children,
  contentScrollRef,
  isFloatingBarLoading,
  isWalletLoading = false,
}: Props) {
  const { handleContentScroll, isHeaderCompact, isDesktopFooterVisible } =
    useHomeViewport({
      contentScrollRef,
    });

  return (
    <PageFrame
      contentAriaLabel="محتوای صفحه اصلی"
      contentScrollRef={contentScrollRef}
      isMobileBackdropRaised={isHeaderCompact}
      onContentScroll={handleContentScroll}
      footer={<DesktopFooter isVisible={isDesktopFooterVisible} />}
      header={
        <HomePageHeader
          isCompact={isHeaderCompact}
          isWalletLoading={isWalletLoading}
        />
      }
      overlays={
        <>
          <FloatingBar loading={isFloatingBarLoading} />
          <FeedbackModal />
        </>
      }
    >
      {children}
    </PageFrame>
  );
}
