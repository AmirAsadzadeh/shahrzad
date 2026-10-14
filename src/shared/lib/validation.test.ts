import { describe, expect, it } from "vitest";
import { isAppError } from "@/shared/api/errors";
import { parseFeedbackInput, parseNonce, parseOtpInput, parsePhoneNumber } from "@/shared/lib/validation";

describe("request validation", () => {
  it("accepts a valid Iranian mobile number", () => {
    expect(parsePhoneNumber("09129998877")).toBe("09129998877");
  });

  it("rejects malformed mobile numbers with a public API error", () => {
    try {
      parsePhoneNumber("123");
      throw new Error("Expected validation to fail");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      expect(error).toMatchObject({ status: 400, code: "BAD_REQUEST" });
    }
  });

  it("accepts six-digit OTP codes and rejects other lengths", () => {
    expect(parseOtpInput("123456")).toBe("123456");
    expect(() => parseOtpInput("12345")).toThrowError("کد اعتبارسنجی صحیح نیست.");
  });

  it("accepts a bounded nonce", () => {
    const nonce = "mock-12345678901234567890";
    expect(parseNonce(nonce)).toBe(nonce);
  });

  it("trims feedback descriptions while preserving the rating", () => {
    expect(parseFeedbackInput({ rating: "good", description: "  عالی بود  " })).toEqual({
      rating: "good",
      description: "عالی بود"
    });
  });

  it("rejects unsupported feedback ratings", () => {
    expect(() => parseFeedbackInput({ rating: "excellent", description: "" })).toThrowError(
      "امتیاز بازخورد الزامی است."
    );
  });
});
