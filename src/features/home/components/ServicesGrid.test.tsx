import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ServicesGrid } from "@/features/home/components/ServicesGrid";

describe("ServicesGrid", () => {
  it("renders an announced loading state with layout-matched skeletons", () => {
    const markup = renderToStaticMarkup(
      <ServicesGrid error={undefined} isLoading tiles={[]} />
    );

    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("در حال بارگذاری خدمات");
    expect(markup.match(/aria-hidden="true"/g)).toHaveLength(24);
  });

  it("does not render a failed request as an empty result", () => {
    const markup = renderToStaticMarkup(
      <ServicesGrid
        error={new Error("request failed")}
        isLoading={false}
        tiles={[]}
      />
    );

    expect(markup).toBe("");
    expect(markup).not.toContain("خدمتی برای نمایش وجود ندارد");
  });

  it("renders the empty state only after a successful empty response", () => {
    const markup = renderToStaticMarkup(
      <ServicesGrid
        error={undefined}
        isLoading={false}
        tiles={[]}
      />
    );

    expect(markup).toContain("خدمتی برای نمایش وجود ندارد");
  });
});
