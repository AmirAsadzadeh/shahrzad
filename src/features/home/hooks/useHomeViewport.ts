"use client";

import { useCallback, useEffect, useState, type RefObject, type UIEvent } from "react";

type Options = {
  authenticated: boolean;
  contentScrollRef: RefObject<HTMLDivElement | null>;
};

type HomeViewportState = {
  handleContentScroll: (event: UIEvent<HTMLDivElement>) => void;
  isHeaderCompact: boolean;
  isDesktopFooterVisible: boolean;
};

const MOBILE_BREAKPOINT = 768;
const COMPACT_THRESHOLD = 60;
const EXPANDED_THRESHOLD = 20;

function getHeaderCompactState(wasCompact: boolean, scrollPosition: number) {
  if (!wasCompact && scrollPosition >= COMPACT_THRESHOLD) return true;
  if (wasCompact && scrollPosition <= EXPANDED_THRESHOLD) return false;

  return wasCompact;
}

export function useHomeViewport({ authenticated, contentScrollRef }: Options): HomeViewportState {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [isDesktopFooterVisible, setIsDesktopFooterVisible] = useState(false);

  const handleContentScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) return;

    const scrollPosition = event.currentTarget.scrollTop;
    setIsHeaderCompact((wasCompact) => getHeaderCompactState(wasCompact, scrollPosition));
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    const isMobileViewport = () => window.innerWidth < MOBILE_BREAKPOINT;

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
  }, [authenticated, contentScrollRef]);

  return { handleContentScroll, isHeaderCompact, isDesktopFooterVisible };
}
