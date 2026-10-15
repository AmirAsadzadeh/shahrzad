import "client-only";

const MOBILE_VIEWPORT_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Browser-only: call this from Client Components or other client-side modules.
 */
export function getPreferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "auto" : "smooth";
}

/**
 * Browser-only: call this from Client Components or other client-side modules.
 */
export function isMobileViewport(): boolean {
  return window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
}
