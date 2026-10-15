"use client";

import type { ReactNode, RefObject, UIEventHandler } from "react";

type Props = {
  children: ReactNode;
  contentAriaLabel: string;
  contentScrollRef?: RefObject<HTMLDivElement | null>;
  footer?: ReactNode;
  header: ReactNode;
  isMobileBackdropRaised: boolean;
  onContentScroll?: UIEventHandler<HTMLDivElement>;
  overlays?: ReactNode;
};

export function PageFrame({
  children,
  contentAriaLabel,
  contentScrollRef,
  footer,
  header,
  isMobileBackdropRaised,
  onContentScroll,
  overlays
}: Props) {
  return (
    <main className="min-h-screen bg-white">
      <div className="relative flex h-dvh flex-col overflow-hidden md:block md:h-auto md:min-h-screen md:overflow-visible">
        <div
          aria-hidden="true"
          className={`shahrzad-pattern pointer-events-none absolute inset-x-0 top-0 z-0 h-50 overflow-clip rounded-b-2xl transition-transform duration-200 md:hidden ${
            isMobileBackdropRaised ? "-translate-y-20" : ""
          }`}
        />
        {header}
        <div
          ref={contentScrollRef}
          onScroll={onContentScroll}
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
