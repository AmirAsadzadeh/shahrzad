import { http } from "@/shared/api/http";

export type FeedbackRating = "good" | "normal" | "bad";

export function getFeedbackVisibility(): Promise<{ showModal: boolean }> {
  return http.get<never, { showModal: boolean }>("/feedback");
}

export function submitFeedback(input: { rating: FeedbackRating; description: string }): Promise<{ submitted: boolean }> {
  return http.post<never, { submitted: boolean }>("/feedback", input);
}
