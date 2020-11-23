import { connect } from "https://deno.land/x/redis/mod.ts";

export const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

export function withKeys(args: string[], fn: (...args: string[]) => unknown) {
  return async () => {
    await redis.del(...args);
    try {
      await fn(...args);
    } catch (e) {
      throw e;
    }
    await redis.del(...args);
  };
}
