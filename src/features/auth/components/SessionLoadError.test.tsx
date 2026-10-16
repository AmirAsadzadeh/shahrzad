import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SessionLoadError } from "@/features/auth/components/SessionLoadError";

describe("SessionLoadError", () => {
  it("announces the session failure and exposes a retry action", () => {
    const markup = renderToStaticMarkup(<SessionLoadError onRetry={() => undefined} />);

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("دریافت اطلاعات حساب انجام نشد");
    expect(markup).toContain("تلاش دوباره");
  });
});
