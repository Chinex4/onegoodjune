import "server-only";
import { createHash } from "node:crypto";
const windowMs = 15 * 60 * 1000;
const localBuckets = new Map<string, { count: number; expires: number }>();
export async function contactRateLimit(request: Request) {
  const trusted = process.env.CONTACT_TRUST_PROXY === "true";
  const ip = trusted
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "shared";
  const key = "ogj:contact:" + createHash("sha256").update(ip).digest("hex");
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const script =
      "local c=redis.call('INCR',KEYS[1]); if c==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return c";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", script, "1", key, String(windowMs)]),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Rate limiter unavailable");
    const result = (await response.json()) as {
      result?: number;
      error?: string;
    };
    if (typeof result.result !== "number" || result.error)
      throw new Error("Rate limiter unavailable");
    return result.result <= 5;
  }
  // In-memory counters are only appropriate for a single-process local preview.
  if (process.env.NODE_ENV === "production")
    throw new Error("Production rate limiter is not configured");
  const now = Date.now();
  for (const [key, bucket] of localBuckets)
    if (bucket.expires <= now) localBuckets.delete(key);
  if (localBuckets.size >= 10000 && !localBuckets.has(key)) return false;
  const current = localBuckets.get(key);
  const bucket =
    current && current.expires > now
      ? current
      : { count: 0, expires: now + windowMs };
  bucket.count++;
  localBuckets.set(key, bucket);
  return bucket.count <= 5;
}
