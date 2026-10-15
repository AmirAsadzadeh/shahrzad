import { http } from "@/shared/api/http";

export type FeedbackRating = "good" | "normal" | "bad";

export type FeedbackInput = {
  rating: FeedbackRating;
  description: string;
};

export type FeedbackVisibility = {
  showModal: boolean;
};

export type FeedbackSubmission = {
  submitted: boolean;
};

export function getFeedbackVisibility(): Promise<FeedbackVisibility> {
  return http.get<never, FeedbackVisibility>("/feedback");
}

export function submitFeedback(input: FeedbackInput): Promise<FeedbackSubmission> {
  return http.post<never, FeedbackSubmission>("/feedback", input);
}
