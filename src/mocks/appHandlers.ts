import { delay, http, HttpResponse } from "msw";
import type { AuthUser } from "@/entities/auth/model/types";
import type { ApiFailure, ApiSuccess } from "@/shared/api/types";
import { AppError, isAppError } from "@/shared/api/errors";
import { enforceRateLimit } from "@/shared/lib/rateLimit";
import { parseFeedbackInput, parseNonce, parseOtpInput, parsePhoneNumber } from "@/shared/lib/validation";
import { homePayload } from "@/mocks/homePayload";

const SESSION_COOKIE_NAME = "shahrzad_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const OTP_TTL_MS = 120 * 1000;
const OTP_CODE = "123456";
const MAX_JSON_BODY_BYTES = 32 * 1024;

type MockRequestContext = {
  request: Request;
  requestId: string;
  cookies: Record<string, string>;
};

type OtpRecord = {
  phoneNumber: string;
  expiresAt: number;
};

const otpRecords = new Map<string, OtpRecord>();

export const appHandlers = [
  http.get("/api/home", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ requestId }) => {
      requireSessionUser(cookies);
      await delay(250);
      return successResponse(requestId, homePayload);
    })
  ),

  http.get("/api/auth/session", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ requestId }) => {
      const user = getSessionUser(cookies);
      return successResponse(requestId, { authenticated: Boolean(user), user });
    })
  ),

  http.post("/api/auth/otp", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ request: apiRequest, requestId }) => {
      enforceRateLimit(`otp:browser:${getClientKey(apiRequest)}`, 10, 60_000);

      const body = await readJsonBody(apiRequest);
      const phoneNumber = parsePhoneNumber(body.phoneNumber);
      enforceRateLimit(`otp:phone:${phoneNumber}`, 3, 10 * 60_000);

      const nonce = createOtpNonce(phoneNumber);
      return successResponse(requestId, {
        status: "login" as const,
        traceNo: crypto.randomUUID(),
        expireIn: 120,
        nonce
      });
    })
  ),

  http.post("/api/auth/verify", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ request: apiRequest, requestId }) => {
      const body = await readJsonBody(apiRequest);
      const phoneNumber = parsePhoneNumber(body.phoneNumber);
      const code = parseOtpInput(body.code);
      const nonce = parseNonce(body.nonce);

      enforceRateLimit(`verify:browser:${getClientKey(apiRequest)}`, 10, 10 * 60_000);
      enforceRateLimit(`verify:phone:${phoneNumber}`, 5, 10 * 60_000);

      if (code !== OTP_CODE) {
        throw new AppError("کد وارد شده صحیح نیست.", { status: 400, code: "BAD_REQUEST" });
      }

      consumeOtpNonce(nonce, phoneNumber);
      return successResponse(
        requestId,
        { user: createUser(phoneNumber) },
        200,
        { "Set-Cookie": createSessionCookie(phoneNumber) }
      );
    })
  ),

  http.post("/api/auth/logout", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ requestId }) => {
      return successResponse(
        requestId,
        { loggedOut: true as const },
        200,
        { "Set-Cookie": clearSessionCookie() }
      );
    })
  ),

  http.get("/api/feedback", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ requestId }) => {
      requireSessionUser(cookies);
      return successResponse(requestId, { showModal: false });
    })
  ),

  http.post("/api/feedback", async ({ request, cookies }) =>
    handleMockRequest(request, cookies, async ({ request: apiRequest, requestId }) => {
      const user = requireSessionUser(cookies);
      enforceRateLimit(`feedback:${user.id}:${getClientKey(apiRequest)}`, 5, 60 * 60_000);

      const body = await readJsonBody(apiRequest);
      const feedback = parseFeedbackInput(body);

      console.info("Feedback accepted", {
        requestId,
        userId: user.id,
        rating: feedback.rating,
        descriptionLength: feedback.description.length
      });

      return successResponse(requestId, { submitted: true }, 201);
    })
  )
];

async function handleMockRequest(
  request: Request,
  cookies: Record<string, string>,
  handler: (context: MockRequestContext) => Promise<Response>
): Promise<Response> {
  const requestId = getRequestId(request);

  try {
    const response = await handler({ request, requestId, cookies });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Request-Id", requestId);
    return response;
  } catch (error) {
    if (isAppError(error)) return failureResponse(requestId, error);

    console.error("Unhandled mock API error", { requestId, error });
    return failureResponse(
      requestId,
      new AppError("خطای داخلی سرور.", { status: 500, code: "INTERNAL_ERROR" })
    );
  }
}

function successResponse<T>(
  requestId: string,
  data: T,
  status = 200,
  extraHeaders: Record<string, string> = {}
): HttpResponse<ApiSuccess<T>> {
  return HttpResponse.json(
    { data, error: null, meta: { requestId } },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Request-Id": requestId,
        ...extraHeaders
      }
    }
  );
}

function failureResponse(requestId: string, error: AppError): HttpResponse<ApiFailure> {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Request-Id": requestId
  };

  if (error.retryAfter) headers["Retry-After"] = String(error.retryAfter);

  return HttpResponse.json(
    {
      data: null,
      error: { code: error.code, message: error.message, details: error.details },
      meta: { requestId }
    },
    { status: error.status, headers }
  );
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
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
    const parsed: unknown = JSON.parse(rawBody);
    if (!isRecord(parsed)) throw new Error("JSON body must be an object");
    return parsed;
  } catch {
    throw new AppError("بدنه درخواست معتبر نیست.", { status: 400, code: "BAD_REQUEST" });
  }
}

function getRequestId(request: Request): string {
  const requestedId = request.headers.get("x-request-id");
  return requestedId && /^[a-zA-Z0-9_-]{1,64}$/.test(requestedId) ? requestedId : crypto.randomUUID();
}

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded || request.headers.get("x-real-ip") || "unknown";
  return candidate.slice(0, 128);
}

function getSessionUser(cookies: Record<string, string>): AuthUser | null {
  const phoneNumber = cookies[SESSION_COOKIE_NAME];
  if (!phoneNumber) return null;

  try {
    return createUser(parsePhoneNumber(phoneNumber));
  } catch {
    return null;
  }
}

function requireSessionUser(cookies: Record<string, string>): AuthUser {
  const user = getSessionUser(cookies);
  if (!user) {
    throw new AppError("برای ادامه وارد حساب کاربری شوید.", { status: 401, code: "UNAUTHORIZED" });
  }

  return user;
}

function createUser(phoneNumber: string): AuthUser {
  return { id: phoneNumber, displayName: "کاربر شهرزاد", mobile: phoneNumber };
}

function createOtpNonce(phoneNumber: string): string {
  const nonce = `mock-${crypto.randomUUID()}-${crypto.randomUUID()}`;
  otpRecords.set(nonce, { phoneNumber, expiresAt: Date.now() + OTP_TTL_MS });
  return nonce;
}

function consumeOtpNonce(nonce: string, phoneNumber: string): void {
  const record = otpRecords.get(nonce);
  otpRecords.delete(nonce);

  if (!record || record.expiresAt <= Date.now() || record.phoneNumber !== phoneNumber) {
    throw new AppError("درخواست اعتبارسنجی نامعتبر است.", { status: 400, code: "BAD_REQUEST" });
  }
}

function createSessionCookie(phoneNumber: string): string {
  return `${SESSION_COOKIE_NAME}=${phoneNumber}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; SameSite=Lax`;
}

function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
