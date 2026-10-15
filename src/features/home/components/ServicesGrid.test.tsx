import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ServicesGrid } from "@/features/home/components/ServicesGrid";

describe("ServicesGrid", () => {
  it("renders an announced loading state with layout-matched skeletons", () => {
    const markup = renderToStaticMarkup(
      <ServicesGrid
        error={undefined}
        isLoading
        onRetry={vi.fn()}
        tiles={[]}
      />
    );

    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("در حال بارگذاری خدمات");
    expect(markup.match(/aria-hidden="true"/g)).toHaveLength(24);
  });

  it("renders a failed request as an error rather than an empty result", () => {
    const markup = renderToStaticMarkup(
      <ServicesGrid
        error={new Error("request failed")}
        isLoading={false}
        onRetry={vi.fn()}
        tiles={[]}
      />
    );

    expect(markup).toContain("خطا در بارگذاری خدمات");
    expect(markup).toContain("تلاش دوباره");
    expect(markup).not.toContain("خدمتی برای نمایش وجود ندارد");
  });

  it("renders the empty state only after a successful empty response", () => {
    const markup = renderToStaticMarkup(
      <ServicesGrid
        error={undefined}
        isLoading={false}
        onRetry={vi.fn()}
        tiles={[]}
      />
    );

    expect(markup).toContain("خدمتی برای نمایش وجود ندارد");
    expect(markup).not.toContain("خطا در بارگذاری خدمات");
  });
});
