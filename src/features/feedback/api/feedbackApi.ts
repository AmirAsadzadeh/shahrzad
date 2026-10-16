import type { FeedbackInput } from "@/entities/feedback/model/types";
import { http } from "@/shared/api/http";
import { isRecord, parseApiData } from "@/shared/api/parseApiData";

export type FeedbackVisibility = {
  showModal: boolean;
};

export type FeedbackSubmission = {
  submitted: boolean;
};

export async function getFeedbackVisibility(): Promise<FeedbackVisibility> {
  const data = await http.get<never, unknown>("/feedback");
  return parseApiData(data, isFeedbackVisibility);
}

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackSubmission> {
  const data = await http.post<never, unknown>("/feedback", input);
  return parseApiData(data, isFeedbackSubmission);
}

function isFeedbackVisibility(value: unknown): value is FeedbackVisibility {
  return isRecord(value) && typeof value.showModal === "boolean";
}

function isFeedbackSubmission(value: unknown): value is FeedbackSubmission {
  return isRecord(value) && typeof value.submitted === "boolean";
}
