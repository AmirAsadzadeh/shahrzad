"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import type { SessionResponse } from "@/entities/auth/model/types";
import { logout as requestLogout } from "@/features/auth/api/authApi";
import { ANONYMOUS_SESSION, AUTH_SESSION_KEY } from "@/features/auth/model/session";
import { APP_ROUTES } from "@/shared/constants/routes";

export function useLogout() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const isLogoutPendingRef = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (isLogoutPendingRef.current) return;

    isLogoutPendingRef.current = true;
    setIsLoggingOut(true);

    try {
      await requestLogout();
      await mutate(
        (key) => key !== AUTH_SESSION_KEY,
        undefined,
        { revalidate: false }
      );
      await mutate<SessionResponse>(AUTH_SESSION_KEY, ANONYMOUS_SESSION, {
        revalidate: false
      });
      router.replace(APP_ROUTES.loginToHome);
    } finally {
      isLogoutPendingRef.current = false;
      setIsLoggingOut(false);
    }
  }, [mutate, router]);

  return { isLoggingOut, logout };
}
