import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/shared/api/errors";
import type { AuthUser } from "@/entities/auth/model/types";

export const SESSION_COOKIE_NAME = "shahrzad_session";

type SignedPayload = {
  type: "otp" | "session";
  exp: number;
  phoneNumber: string;
  user?: AuthUser;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const OTP_TTL_SECONDS = 120;
const consumedOtpNonces = new Map<string, number>();

export function createOtpNonce(phoneNumber: string): string {
  return signPayload({
    type: "otp",
    exp: Math.floor(Date.now() / 1000) + OTP_TTL_SECONDS,
    phoneNumber
  });
}

export function consumeOtpNonce(nonce: string, phoneNumber: string): void {
  const payload = readOtpPayload(nonce, phoneNumber);
  const now = Math.floor(Date.now() / 1000);

  for (const [usedNonce, expiresAt] of consumedOtpNonces) {
    if (expiresAt <= now) consumedOtpNonces.delete(usedNonce);
  }

  if (consumedOtpNonces.has(nonce)) {
    throw new AppError("این کد قبلا استفاده شده است.", { status: 400, code: "BAD_REQUEST" });
  }

  consumedOtpNonces.set(nonce, payload.exp);
}

export function createSessionResponseCookie(response: NextResponse, phoneNumber: string): void {
  const user: AuthUser = {
    id: phoneNumber,
    displayName: "کاربر شهرزاد",
    mobile: phoneNumber
  };

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: signPayload({
      type: "session",
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
      phoneNumber,
      user
    }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/"
  });
}

export function getSessionUser(request: NextRequest | Request): AuthUser | null {
  getSecret();
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));
  const token = cookie?.slice(`${SESSION_COOKIE_NAME}=`.length);

  if (!token) return null;

  try {
    const payload = readPayload(token);
    return payload.type === "session" && payload.user ? payload.user : null;
  } catch {
    return null;
  }
}

export function requireSessionUser(request: NextRequest | Request): AuthUser {
  const user = getSessionUser(request);
  if (!user) {
    throw new AppError("برای ادامه وارد حساب کاربری شوید.", { status: 401, code: "UNAUTHORIZED" });
  }

  return user;
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });
}

function signPayload(payload: SignedPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function readPayload(token: string): SignedPayload {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || !isValidSignature(encoded, signature)) {
    throw new Error("Invalid signed payload");
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SignedPayload;
  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Expired signed payload");
  }

  return payload;
}

function readOtpPayload(nonce: string, phoneNumber: string): SignedPayload {
  getSecret();

  try {
    const payload = readPayload(nonce);
    if (payload.type !== "otp" || payload.phoneNumber !== phoneNumber) {
      throw new Error("Mismatched OTP payload");
    }

    return payload;
  } catch {
    throw new AppError("درخواست اعتبارسنجی نامعتبر است.", { status: 400, code: "BAD_REQUEST" });
  }
}

function isValidSignature(encoded: string, signature: string): boolean {
  const expected = createHmac("sha256", getSecret()).update(encoded).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function getSecret(): string {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SESSION_SECRET) {
    throw new Error("AUTH_SESSION_SECRET must be configured in production");
  }

  return process.env.AUTH_SESSION_SECRET || "local-development-session-secret";
}
