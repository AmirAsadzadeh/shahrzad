export type AuthUser = {
  id: string;
  displayName: string;
  mobile: string;
};

export type SessionResponse =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false; user: null };

export type OtpRequestResponse = {
  status: "login";
  traceNo: string;
  expireIn: number;
  nonce: string;
  hint?: string;
};
