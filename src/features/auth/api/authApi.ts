import type { AuthUser, OtpRequestResponse, SessionResponse } from "@/entities/auth/model/types";
import { http } from "@/shared/api/http";
import { isRecord, parseApiData } from "@/shared/api/parseApiData";

export async function requestOtp(phoneNumber: string): Promise<OtpRequestResponse> {
  const data = await http.post<never, unknown>("/auth/otp", { phoneNumber });
  return parseApiData(data, isOtpRequestResponse);
}

export async function verifyOtp(phoneNumber: string, code: string, nonce: string): Promise<{ user: AuthUser }> {
  const data = await http.post<never, unknown>("/auth/verify", { phoneNumber, code, nonce });
  return parseApiData(data, isVerifyOtpResponse);
}

export async function getSession(): Promise<SessionResponse> {
  const data = await http.get<never, unknown>("/auth/session");
  return parseApiData(data, isSessionResponse);
}

export async function logout(): Promise<{ loggedOut: true }> {
  const data = await http.post<never, unknown>("/auth/logout");
  return parseApiData(data, isLogoutResponse);
}

function isAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.displayName === "string" &&
    typeof value.mobile === "string"
  );
}

function isOtpRequestResponse(value: unknown): value is OtpRequestResponse {
  return (
    isRecord(value) &&
    value.status === "login" &&
    typeof value.traceNo === "string" &&
    typeof value.expireIn === "number" &&
    typeof value.nonce === "string" &&
    (value.hint === undefined || typeof value.hint === "string")
  );
}

function isVerifyOtpResponse(value: unknown): value is { user: AuthUser } {
  return isRecord(value) && isAuthUser(value.user);
}

function isSessionResponse(value: unknown): value is SessionResponse {
  return (
    isRecord(value) &&
    ((value.authenticated === true && isAuthUser(value.user)) ||
      (value.authenticated === false && value.user === null))
  );
}

function isLogoutResponse(value: unknown): value is { loggedOut: true } {
  return isRecord(value) && value.loggedOut === true;
}
