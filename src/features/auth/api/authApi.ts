import type { AuthUser, OtpRequestResponse, SessionResponse } from "@/entities/auth/model/types";
import { http } from "@/shared/api/http";

export function requestOtp(phoneNumber: string): Promise<OtpRequestResponse> {
  return http.post<never, OtpRequestResponse>("/auth/otp", { phoneNumber });
}

export function verifyOtp(phoneNumber: string, code: string, nonce: string): Promise<{ user: AuthUser }> {
  return http.post<never, { user: AuthUser }>("/auth/verify", { phoneNumber, code, nonce });
}

export function getSession(): Promise<SessionResponse> {
  return http.get<never, SessionResponse>("/auth/session");
}

export function logout(): Promise<{ loggedOut: true }> {
  return http.post<never, { loggedOut: true }>("/auth/logout");
}
