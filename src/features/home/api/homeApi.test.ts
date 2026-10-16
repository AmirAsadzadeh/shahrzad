import { afterEach, describe, expect, it, vi } from "vitest";
import { getHomeData } from "@/features/home/api/homeApi";
import { http } from "@/shared/api/http";

describe("getHomeData", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns a valid home payload", async () => {
    vi.spyOn(http, "get").mockResolvedValue({ tiles: [], banners: [] });

    await expect(getHomeData()).resolves.toEqual({ tiles: [], banners: [] });
  });

  it("rejects malformed nested service tiles", async () => {
    vi.spyOn(http, "get").mockResolvedValue({
      tiles: [{ id: 1, title: "خدمت ناقص" }],
      banners: []
    });

    await expect(getHomeData()).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      status: 502
    });
  });
});
