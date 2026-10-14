"use client";

import useSWR from "swr";
import type { SessionResponse } from "@/entities/auth/model/types";
import { getSession } from "@/features/auth/api/authApi";

export function useAuthSession() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<SessionResponse>("/auth/session", getSession, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  return {
    user: data?.user ?? null,
    authenticated: data?.authenticated ?? false,
    loading: isLoading || isValidating,
    error,
    refresh: mutate
  };
}
