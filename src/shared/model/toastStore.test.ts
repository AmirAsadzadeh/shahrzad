import { beforeEach, describe, expect, it } from "vitest";
import { showErrorToast, toastStore } from "@/shared/model/toastStore";

describe("toastStore", () => {
  beforeEach(() => {
    toastStore.setState({ toast: undefined });
  });

  it("publishes each backend error as a distinct toast event", () => {
    showErrorToast("خطای اول");
    const firstToast = toastStore.getState().toast;

    showErrorToast("خطای دوم");
    const secondToast = toastStore.getState().toast;

    expect(firstToast).toMatchObject({ message: "خطای اول", type: "error" });
    expect(secondToast).toMatchObject({ message: "خطای دوم", type: "error" });
    expect(secondToast?.id).toBeGreaterThan(firstToast?.id ?? 0);
  });
});
