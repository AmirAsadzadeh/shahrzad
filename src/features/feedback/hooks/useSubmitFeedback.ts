"use client";

import useSWRMutation from "swr/mutation";
import {
  submitFeedback,
  type FeedbackInput,
} from "@/features/feedback/api/feedbackApi";

const FEEDBACK_SUBMISSION_KEY = "feedback/submission";

function submitFeedbackMutation(
  _key: string,
  { arg }: { arg: FeedbackInput },
) {
  return submitFeedback(arg);
}

export function useSubmitFeedback() {
  const { error, isMutating, reset, trigger } = useSWRMutation(
    FEEDBACK_SUBMISSION_KEY,
    submitFeedbackMutation,
  );

  return {
    error,
    isSubmitting: isMutating,
    reset,
    submit: trigger,
  };
}
