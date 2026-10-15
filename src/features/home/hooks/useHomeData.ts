"use client";

import useSWR from "swr";
import type { HomePayload } from "@/entities/home/model/types";
import { getHomeData } from "@/features/home/api/homeApi";

const fetcher = async () => getHomeData();

export function useHomeData(enabled = true) {
  const { data, error, isLoading } = useSWR<HomePayload>(enabled ? "/home" : null, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    errorRetryInterval: 1000
  });

  return {
    data,
    error,
    loading: isLoading
  };
}
