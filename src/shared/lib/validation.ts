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
