import { NextResponse } from "next/server";
import { AppError, isAppError } from "@/shared/api/errors";
import type { ApiFailure, ApiSuccess } from "@/shared/api/types";

const MAX_JSON_BODY_BYTES = 32 * 1024;

type ApiContext = {
  request: Request;
  requestId: string;
};

type ApiHandler<T> = (context: ApiContext) => Promise<NextResponse<T>>;

export async function handleApiRequest<T>(request: Request, handler: ApiHandler<T>): Promise<NextResponse> {
  const requestedId = request.headers.get("x-request-id");
  const requestId = requestedId && /^[a-zA-Z0-9_-]{1,64}$/.test(requestedId) ? requestedId : crypto.randomUUID();

  try {
    const response = await handler({ request, requestId });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Request-Id", requestId);
    return response;
  } catch (error) {
    if (isAppError(error)) {
      return failureResponse(requestId, error);
    }

    console.error("Unhandled API error", { requestId, error });
    return failureResponse(
      requestId,
      new AppError("خطای داخلی سرور.", { status: 500, code: "INTERNAL_ERROR" })
    );
  }
}

export function successResponse<T>(requestId: string, data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { data, error: null, meta: { requestId } },
    { status, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } }
  );
}

export async function readJsonBody<T>(request: Request): Promise<T> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new AppError("نوع محتوای درخواست معتبر نیست.", { status: 415, code: "UNSUPPORTED_MEDIA_TYPE" });
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BODY_BYTES) {
    throw new AppError("حجم درخواست بیش از حد مجاز است.", { status: 413, code: "PAYLOAD_TOO_LARGE" });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_JSON_BODY_BYTES) {
    throw new AppError("حجم درخواست بیش از حد مجاز است.", { status: 413, code: "PAYLOAD_TOO_LARGE" });
  }

  if (!rawBody.trim()) {
    throw new AppError("بدنه درخواست الزامی است.", { status: 400, code: "BAD_REQUEST" });
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new AppError("بدنه درخواست معتبر نیست.", { status: 400, code: "BAD_REQUEST" });
  }
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded || request.headers.get("x-real-ip") || "unknown";
  return candidate.slice(0, 128);
}

function failureResponse(requestId: string, error: AppError): NextResponse<ApiFailure> {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Request-Id": requestId
  };

  if (error.retryAfter) headers["Retry-After"] = String(error.retryAfter);

  return NextResponse.json(
    {
      data: null,
      error: { code: error.code, message: error.message, details: error.details },
      meta: { requestId }
    },
    { status: error.status, headers }
  );
}
