export type FeedbackRating = "good" | "normal" | "bad";

export type FeedbackInput = {
  rating: FeedbackRating;
  description: string;
};
