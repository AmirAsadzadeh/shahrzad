import { afterEach, describe, expect, it, vi } from "vitest";
import { getSession } from "@/features/auth/api/authApi";
import { http } from "@/shared/api/http";

describe("getSession", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns a valid authenticated session", async () => {
    const session = {
      authenticated: true,
      user: { id: "user-1", displayName: "کاربر شهرزاد", mobile: "09129998877" }
    } as const;
    vi.spyOn(http, "get").mockResolvedValue(session);

    await expect(getSession()).resolves.toEqual(session);
  });

  it("rejects an authenticated session without a user", async () => {
    vi.spyOn(http, "get").mockResolvedValue({ authenticated: true, user: null });

    await expect(getSession()).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      status: 502
    });
  });
});
