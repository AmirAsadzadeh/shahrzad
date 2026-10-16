import { describe, expect, it } from "vitest";
import { parseFeedbackInput } from "@/mocks/feedbackValidation";

describe("parseFeedbackInput", () => {
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
