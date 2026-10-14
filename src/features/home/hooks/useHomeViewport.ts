"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  authenticated: boolean;
  contentScrollRef: RefObject<HTMLDivElement | null>;
};

type HomeViewportState = {
  isHeaderCompact: boolean;
  isDesktopFooterVisible: boolean;
};

export function useHomeViewport({ authenticated, contentScrollRef }: Options): HomeViewportState {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [isDesktopFooterVisible, setIsDesktopFooterVisible] = useState(false);

  useEffect(() => {
    if (!authenticated) return;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const contentScroller = contentScrollRef.current;

    const updateHeaderState = (scrollPosition: number) => {
      setIsHeaderCompact((wasCompact) => {
        const compactThreshold = mobileQuery.matches ? 60 : 180;
        const expandedThreshold = mobileQuery.matches ? 20 : 60;

        if (!wasCompact && scrollPosition >= compactThreshold) return true;
        if (wasCompact && scrollPosition <= expandedThreshold) return false;

        return wasCompact;
      });
    };

    const updateDesktopFooter = () => {
      if (mobileQuery.matches) {
        setIsDesktopFooterVisible(false);
        return;
      }

      const remainingScroll = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      setIsDesktopFooterVisible(remainingScroll <= 2);
    };

    const updateFromWindow = () => {
      if (mobileQuery.matches) return;

      setIsHeaderCompact(false);
      updateDesktopFooter();
    };

    const updateFromContent = () => {
      if (!mobileQuery.matches || !contentScroller) return;

      updateHeaderState(contentScroller.scrollTop);
    };

    const handleViewportChange = () => {
      setIsHeaderCompact(false);
      setIsDesktopFooterVisible(false);
      updateFromWindow();
      updateFromContent();
    };

    updateFromWindow();
    updateFromContent();
    window.addEventListener("scroll", updateFromWindow, { passive: true });
    window.addEventListener("resize", handleViewportChange, { passive: true });
    contentScroller?.addEventListener("scroll", updateFromContent, { passive: true });
    mobileQuery.addEventListener("change", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", updateFromWindow);
      window.removeEventListener("resize", handleViewportChange);
      contentScroller?.removeEventListener("scroll", updateFromContent);
      mobileQuery.removeEventListener("change", handleViewportChange);
    };
  }, [authenticated, contentScrollRef]);

  return { isHeaderCompact, isDesktopFooterVisible };
}
