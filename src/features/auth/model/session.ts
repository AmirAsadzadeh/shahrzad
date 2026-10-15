import type { SessionResponse } from "@/entities/auth/model/types";

export const AUTH_SESSION_KEY = "/auth/session";

export const ANONYMOUS_SESSION: SessionResponse = {
  authenticated: false,
  user: null
};
