import { AppError } from "@/shared/api/errors";

const PHONE_PATTERN = /^09\d{9}$/;
const OTP_PATTERN = /^\d{6}$/;

export function parsePhoneNumber(value: unknown): string {
  if (typeof value !== "string" || !PHONE_PATTERN.test(value)) {
    throw new AppError("فرمت شماره موبایل صحیح نیست.", {
      status: 400,
      code: "BAD_REQUEST",
      details: { phoneNumber: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود." }
    });
  }

  return value;
}

export function parseOtpInput(value: unknown): string {
  if (typeof value !== "string" || !OTP_PATTERN.test(value)) {
    throw new AppError("کد اعتبارسنجی صحیح نیست.", {
      status: 400,
      code: "BAD_REQUEST",
      details: { code: "کد اعتبارسنجی باید ۶ رقم باشد." }
    });
  }

  return value;
}

export function parseNonce(value: unknown): string {
  if (typeof value !== "string" || value.length < 20 || value.length > 512) {
    throw new AppError("درخواست اعتبارسنجی منقضی یا نامعتبر است.", { status: 400, code: "BAD_REQUEST" });
  }

  return value;
}

export type FeedbackInput = {
  rating: "good" | "normal" | "bad";
  description: string;
};

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

function isFeedbackRating(value: unknown): value is FeedbackInput["rating"] {
  return value === "good" || value === "normal" || value === "bad";
}
