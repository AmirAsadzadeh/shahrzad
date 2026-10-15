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

function getHeaderCompactState(wasCompact: boolean, scrollPosition: number) {
  if (!wasCompact && scrollPosition >= COMPACT_THRESHOLD) return true;
  if (wasCompact && scrollPosition <= EXPANDED_THRESHOLD) return false;

  return wasCompact;
}

export function useHomeViewport({ contentScrollRef }: Options): HomeViewportState {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [isDesktopFooterVisible, setIsDesktopFooterVisible] = useState(false);

  const handleContentScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (!isMobileViewport()) return;

    const scrollPosition = event.currentTarget.scrollTop;
    setIsHeaderCompact((wasCompact) => getHeaderCompactState(wasCompact, scrollPosition));
  }, []);

  useEffect(() => {
    const updateDesktopFooter = () => {
      if (isMobileViewport()) {
        setIsDesktopFooterVisible(false);
        return;
      }

      const remainingScroll = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      setIsDesktopFooterVisible(remainingScroll <= 2);
    };

    const updateFromWindow = () => {
      if (isMobileViewport()) return;

      setIsHeaderCompact(false);
      updateDesktopFooter();
    };

    const updateFromContent = () => {
      const contentScroller = contentScrollRef.current;
      if (!isMobileViewport() || !contentScroller) return;

      setIsHeaderCompact((wasCompact) =>
        getHeaderCompactState(wasCompact, contentScroller.scrollTop)
      );
    };

    const synchronizeViewport = () => {
      if (isMobileViewport()) {
        setIsDesktopFooterVisible(false);
        updateFromContent();
        return;
      }

      updateFromWindow();
    };

    const handleViewportChange = () => {
      setIsHeaderCompact(false);
      setIsDesktopFooterVisible(false);
      synchronizeViewport();
    };

    const handlePageShow = () => {
      synchronizeViewport();
    };

    synchronizeViewport();
    window.addEventListener("scroll", updateFromWindow, { passive: true });
    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("scroll", updateFromWindow);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [contentScrollRef]);

  return { handleContentScroll, isHeaderCompact, isDesktopFooterVisible };
}
