import { AppError } from "@/shared/api/errors";
import { showErrorToast } from "@/shared/model/toastStore";

type DataGuard<T> = (value: unknown) => value is T;

export function parseApiData<T>(value: unknown, guard: DataGuard<T>): T {
  if (guard(value)) return value;

  const error = new AppError("پاسخ دریافتی از سرور معتبر نیست.", {
    status: 502,
    code: "UPSTREAM_ERROR"
  });

  showErrorToast(error.message);
  throw error;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
