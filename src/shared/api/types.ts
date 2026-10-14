export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

export type ApiErrorBody = {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string>;
};

export type ApiMeta = {
  requestId: string;
};

export type ApiSuccess<T> = {
  data: T;
  error: null;
  meta: ApiMeta;
};

export type ApiFailure = {
  data: null;
  error: ApiErrorBody;
  meta: ApiMeta;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
