import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { server } from "@/mocks/server";

const API_ORIGIN = "http://localhost";
const PHONE_NUMBER = "09129998877";

Object.defineProperty(globalThis, "location", {
  configurable: true,
  value: new URL(`${API_ORIGIN}/`)
});

async function readResponse(response: Response) {
  return {
    status: response.status,
    body: (await response.json()) as {
      data: Record<string, unknown> | null;
      error: { code: string; message: string } | null;
      meta: { requestId: string };
    }
  };
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("application mock API", () => {
  it("rejects protected home data without a session", async () => {
    const response = await fetch(`${API_ORIGIN}/api/home`);
    const result = await readResponse(response);

    expect(result.status).toBe(401);
    expect(result.body.error).toMatchObject({ code: "UNAUTHORIZED" });
    expect(result.body.meta.requestId).toEqual(expect.any(String));
  });

  it("completes the OTP flow and returns protected home data", async () => {
    const otpResponse = await fetch(`${API_ORIGIN}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: PHONE_NUMBER })
    });
    const otpResult = await readResponse(otpResponse);
    const nonce = otpResult.body.data?.nonce;

    expect(otpResult.status).toBe(200);
    expect(nonce).toEqual(expect.any(String));

    const verifyResponse = await fetch(`${API_ORIGIN}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: PHONE_NUMBER, code: "123456", nonce })
    });
    const verifyResult = await readResponse(verifyResponse);
    const homeResponse = await fetch(`${API_ORIGIN}/api/home`, {
      headers: { Cookie: `shahrzad_session=${PHONE_NUMBER}` }
    });
    const homeResult = await readResponse(homeResponse);

    expect(verifyResult.status).toBe(200);
    expect(verifyResult.body.data?.user).toMatchObject({ mobile: PHONE_NUMBER });
    expect(verifyResponse.headers.get("set-cookie")).toContain("shahrzad_session=");
    expect(homeResult.status).toBe(200);
    expect(homeResult.body.data?.tiles).toEqual(expect.any(Array));
    expect(homeResult.body.data?.banners).toEqual(expect.any(Array));
  });

  it("returns a validation error for malformed JSON requests", async () => {
    const response = await fetch(`${API_ORIGIN}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "[]"
    });
    const result = await readResponse(response);

    expect(result.status).toBe(400);
    expect(result.body.error).toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns unsupported-media-type for non-JSON request bodies", async () => {
    const response = await fetch(`${API_ORIGIN}/api/auth/otp`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "phoneNumber=09129998877"
    });
    const result = await readResponse(response);

    expect(result.status).toBe(415);
    expect(result.body.error).toMatchObject({ code: "UNSUPPORTED_MEDIA_TYPE" });
  });
});
