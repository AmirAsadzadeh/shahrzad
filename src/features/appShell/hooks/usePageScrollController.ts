"use client";

import { useCallback, useRef } from "react";
import { getPreferredScrollBehavior, isMobileViewport } from "@/shared/lib/mediaQuery";

export function usePageScrollController() {
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    const behavior = getPreferredScrollBehavior();

    if (isMobileViewport() && contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior });
      return;
    }

    window.scrollTo({ top: 0, behavior });
  }, []);

  return { contentScrollRef, scrollToTop };
}
