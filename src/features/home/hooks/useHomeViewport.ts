"use client";

import { useCallback, useEffect, useState, type RefObject, type UIEvent } from "react";
import { isMobileViewport } from "@/shared/lib/mediaQuery";

type Options = {
  contentScrollRef: RefObject<HTMLDivElement | null>;
};

type HomeViewportState = {
  handleContentScroll: (event: UIEvent<HTMLDivElement>) => void;
  isHeaderCompact: boolean;
  isDesktopFooterVisible: boolean;
};

const COMPACT_THRESHOLD = 60;
const EXPANDED_THRESHOLD = 20;
const SCROLL_END_TOLERANCE = 2;

function getHeaderCompactState(wasCompact: boolean, scrollPosition: number) {
  if (!wasCompact && scrollPosition >= COMPACT_THRESHOLD) return true;
  if (wasCompact && scrollPosition <= EXPANDED_THRESHOLD) return false;

  return wasCompact;
}

function isScrolledToEnd(element: HTMLDivElement) {
  const remainingScroll = element.scrollHeight - element.clientHeight - element.scrollTop;
  return remainingScroll <= SCROLL_END_TOLERANCE;
}

export function useHomeViewport({ contentScrollRef }: Options): HomeViewportState {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [isDesktopFooterVisible, setIsDesktopFooterVisible] = useState(false);

  const handleContentScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const contentScroller = event.currentTarget;

    if (!isMobileViewport()) {
      setIsHeaderCompact(false);
      setIsDesktopFooterVisible(isScrolledToEnd(contentScroller));
      return;
    }

    setIsDesktopFooterVisible(false);
    const scrollPosition = contentScroller.scrollTop;
    setIsHeaderCompact((wasCompact) => getHeaderCompactState(wasCompact, scrollPosition));
  }, []);

  useEffect(() => {
    const updateFromContent = () => {
      const contentScroller = contentScrollRef.current;
      if (!contentScroller) return;

      if (!isMobileViewport()) {
        setIsHeaderCompact(false);
        setIsDesktopFooterVisible(isScrolledToEnd(contentScroller));
        return;
      }

      setIsDesktopFooterVisible(false);
      setIsHeaderCompact((wasCompact) =>
        getHeaderCompactState(wasCompact, contentScroller.scrollTop)
      );
    };

    updateFromContent();
    window.addEventListener("resize", updateFromContent, { passive: true });
    window.addEventListener("pageshow", updateFromContent);

    return () => {
      window.removeEventListener("resize", updateFromContent);
      window.removeEventListener("pageshow", updateFromContent);
    };
  }, [contentScrollRef]);

  return { handleContentScroll, isHeaderCompact, isDesktopFooterVisible };
}
