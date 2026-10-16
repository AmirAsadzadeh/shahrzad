import { afterEach, describe, expect, it, vi } from "vitest";
import { getFeedbackVisibility } from "@/features/feedback/api/feedbackApi";
import { http } from "@/shared/api/http";

describe("getFeedbackVisibility", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns a valid visibility response", async () => {
    vi.spyOn(http, "get").mockResolvedValue({ showModal: true });

    await expect(getFeedbackVisibility()).resolves.toEqual({ showModal: true });
  });

  it("rejects a malformed visibility response", async () => {
    vi.spyOn(http, "get").mockResolvedValue({ showModal: "yes" });

    await expect(getFeedbackVisibility()).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      status: 502
    });
  });
});
