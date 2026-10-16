"use client";

import useSWR from "swr";
import type { SessionResponse } from "@/entities/auth/model/types";
import { getSession } from "@/features/auth/api/authApi";
import { AUTH_SESSION_KEY } from "@/features/auth/model/session";

export function useAuthSession() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SessionResponse>(AUTH_SESSION_KEY, getSession, {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    });

  return {
    user: data?.user ?? null,
    authenticated: data?.authenticated ?? false,
    loading: isLoading,
    validating: isValidating,
    error,
    refresh: () => mutate(),
  };
}
