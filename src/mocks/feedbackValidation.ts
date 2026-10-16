import type { FeedbackInput, FeedbackRating } from "@/entities/feedback/model/types";
import { AppError } from "@/shared/api/errors";

export function parseFeedbackInput(value: unknown): FeedbackInput {
  if (!isRecord(value) || !isFeedbackRating(value.rating)) {
    throw new AppError("امتیاز بازخورد الزامی است.", {
      status: 400,
      code: "BAD_REQUEST",
      details: { rating: "امتیاز انتخاب‌شده معتبر نیست." }
    });
  }

  const description = typeof value.description === "string" ? value.description.trim() : "";
  if (description.length > 2000) {
    throw new AppError("متن بازخورد بیش از حد مجاز است.", { status: 400, code: "BAD_REQUEST" });
  }

  return { rating: value.rating, description };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isFeedbackRating(value: unknown): value is FeedbackRating {
  return value === "good" || value === "normal" || value === "bad";
}
