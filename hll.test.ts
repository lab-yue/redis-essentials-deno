import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { redis, withKeys } from "./index.ts";

Deno.test(
  "HyperLogLogs",
  withKeys(["day1", "day2", "total"], async (day1, day2, total) => {
    assertEquals(await redis.pfadd(day1, "carl", "max", "hugo", "arthur"), 1);
    assertEquals(await redis.pfadd(day1, "max", "hugo"), 0);
    assertEquals(await redis.pfadd(day2, "kc", "renata"), 1);
    assertEquals(await redis.pfcount(day1), 4);
    assertEquals(await redis.pfcount(day1, day2), 6);
    assertEquals(await redis.pfmerge(total, day1, day2), "OK");
    assertEquals(await redis.pfcount(total), 6);
  })
);
