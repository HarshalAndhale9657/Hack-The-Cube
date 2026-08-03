"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query hook — returns true when the media query matches.
 * Uses useSyncExternalStore so it stays in sync with the browser
 * without a setState-in-effect (SSR-safe: server snapshot is false).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Convenience hooks for common breakpoints
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsTouchDevice() {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}
