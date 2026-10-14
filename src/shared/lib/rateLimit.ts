import { AppError } from "@/shared/api/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function enforceRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) {
    clearExpiredBuckets();
    if (buckets.size >= MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey) buckets.delete(oldestKey);
    }
  }

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new AppError("تعداد درخواست‌ها بیش از حد مجاز است.", {
      status: 429,
      code: "RATE_LIMITED",
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    });
  }

  current.count += 1;
}

export function clearExpiredBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
