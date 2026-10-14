import type { ApiErrorCode } from "@/shared/api/types";

export class AppError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: Record<string, string>;
  readonly retryAfter?: number;

  constructor(
    message: string,
    options: {
      status: number;
      code: ApiErrorCode;
      details?: Record<string, string>;
      retryAfter?: number;
    }
  ) {
    super(message);
    this.name = "AppError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.retryAfter = options.retryAfter;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
