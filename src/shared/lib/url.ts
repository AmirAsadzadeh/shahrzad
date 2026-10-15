import { APP_ROUTES } from "@/shared/constants/routes";

const trustedOrigins = new Set([
  "https://shahrzadcity.ir",
  "https://www.shahrzadcity.ir",
  "https://web.shahrzadcity.ir",
  "https://static.shahrzadcity.ir"
]);

export function safeHref(value: string | undefined, fallback = APP_ROUTES.home): string {
  if (!value) return fallback;
  if (isSafeInternalPath(value)) return value;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && trustedOrigins.has(parsed.origin) ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function safeInternalPath(value: string | null, fallback = APP_ROUTES.home): string {
  return value && isSafeInternalPath(value) ? value : fallback;
}

export function safeAssetSrc(value: string | undefined): string | null {
  if (!value) return null;
  if (isSafeInternalPath(value)) return value;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && trustedOrigins.has(parsed.origin) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function isSafeInternalPath(value: string): boolean {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\") &&
    !/[\u0000-\u001f]/.test(value)
  );
}
