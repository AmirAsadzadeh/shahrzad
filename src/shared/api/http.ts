import axios, { type AxiosError } from "axios";
import type { ApiErrorBody, ApiErrorCode, ApiResponse } from "@/shared/api/types";
import { AppError } from "@/shared/api/errors";
import { showErrorToast } from "@/shared/model/toastStore";

const apiBaseUrl = "/api";

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    platform: "pwa"
  }
});

http.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown> | unknown;

    if (!isApiResponse(body)) {
      throwApiError(
        new AppError("پاسخ دریافتی از سرور معتبر نیست.", {
          status: 502,
          code: "UPSTREAM_ERROR"
        })
      );
    }

    if (body.error) {
      throwApiError(
        new AppError(body.error.message, {
          status: response.status,
          code: body.error.code,
          details: body.error.details
        })
      );
    }

    return body.data as never;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const responseBody = error.response?.data;
    const responseError = isApiResponse(responseBody) ? responseBody.error : null;

    throwApiError(
      new AppError(
        responseError?.message ||
          (error.request ? "ارتباط با سرور برقرار نشد." : "خطای غیرمنتظره‌ای رخ داد."),
        {
          status: error.response?.status ?? 503,
          code: responseError?.code ?? "UPSTREAM_ERROR",
          details: responseError?.details
        }
      )
    );
  }
);

function throwApiError(error: AppError): never {
  showErrorToast(error.message);
  throw error;
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return Boolean(
    isRecord(value) &&
      "data" in value &&
      "error" in value &&
      "meta" in value &&
      isRecord(value.meta) &&
      typeof value.meta.requestId === "string" &&
      (value.error === null || isApiErrorBody(value.error))
  );
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return Boolean(
    isRecord(value) &&
      isApiErrorCode(value.code) &&
      typeof value.message === "string" &&
      (value.details === undefined || isStringRecord(value.details))
  );
}

function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return (
    value === "BAD_REQUEST" ||
    value === "UNAUTHORIZED" ||
    value === "FORBIDDEN" ||
    value === "NOT_FOUND" ||
    value === "RATE_LIMITED" ||
    value === "PAYLOAD_TOO_LARGE" ||
    value === "UNSUPPORTED_MEDIA_TYPE" ||
    value === "UPSTREAM_ERROR" ||
    value === "INTERNAL_ERROR"
  );
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => typeof entry === "string")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
