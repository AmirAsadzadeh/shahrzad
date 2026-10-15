"use client";

import useSWR from "swr";
import {
  getFeedbackVisibility,
  type FeedbackVisibility,
} from "@/features/feedback/api/feedbackApi";

const FEEDBACK_VISIBILITY_KEY = "feedback/visibility";

export function useFeedbackVisibility() {
  const { data, error, isLoading } = useSWR<FeedbackVisibility>(
    FEEDBACK_VISIBILITY_KEY,
    getFeedbackVisibility,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  return {
    error,
    isLoading,
    shouldShow: data?.showModal ?? false,
  };
}
