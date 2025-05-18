// redisClient.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.Redis_Url!,
  token: process.env.Redis_Token!,
})



export interface RateLimitResult {
  success: boolean;
  retryAfter?: number;
}

// Time-to-live in seconds
const TTL_SECONDS = 60; // 1 minute

export async function rateLimit(
  identifier: string, // e.g., IP address or email
  limit = 5,
  ttl = TTL_SECONDS
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`;

  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, ttl); // set TTL only on first attempt
    }

    if (current > limit) {
      const retryAfter = await redis.ttl(key);
      return { success: false, retryAfter };
    }

    return { success: true };
  } catch (err) {
    console.error("[RateLimiter] Redis error:", err);
    // Fail open: allow request if Redis fails (optional)
    return { success: true };
  }
}