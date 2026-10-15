"use client";

import { useCallback, useRef } from "react";
import { getPreferredScrollBehavior } from "@/shared/lib/mediaQuery";

export function usePageScrollController() {
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    const behavior = getPreferredScrollBehavior();

    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior });
    }
  }, []);

  return { contentScrollRef, scrollToTop };
}
