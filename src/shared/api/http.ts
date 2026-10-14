import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/shared/api/types";
import { AppError } from "@/shared/api/errors";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

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

    if (isApiResponse(body)) {
      if (body.error) {
        throw new AppError(body.error.message, {
          status: response.status,
          code: body.error.code,
          details: body.error.details
        });
      }

      return body.data as never;
    }

    return body as never;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const responseBody = error.response?.data;
    const responseError = isApiResponse(responseBody) ? responseBody.error : null;

    throw new AppError(
      responseError?.message || (error.request ? "ارتباط با سرور برقرار نشد." : "خطای غیرمنتظره‌ای رخ داد."),
      {
        status: error.response?.status ?? 0,
        code: responseError?.code ?? "UPSTREAM_ERROR",
        details: responseError?.details
      }
    );
  }
);

export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return http.request<never, T>(config).then((response) => response as unknown as T);
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return Boolean(
    value &&
      typeof value === "object" &&
      "data" in value &&
      "error" in value &&
      "meta" in value
  );
}
