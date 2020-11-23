import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { redis, withKeys } from "./index.ts";

Deno.test(
  "bitmaps",
  withKeys(["day1", "day2"], async (day1, day2) => {
    assertEquals(await redis.setbit(day1, 5, "1"), 0);
    assertEquals(await redis.setbit(day1, 10, "1"), 0);
    assertEquals(await redis.setbit(day1, 15, "1"), 0);
    assertEquals(await redis.setbit(day1, 20, "1"), 0);
    assertEquals(await redis.setbit(day2, 100, "1"), 0);
    assertEquals(await redis.getbit(day1, 5), 1);
    assertEquals(await redis.getbit(day1, 100), 0);
    assertEquals(await redis.bitcount(day1), 4);
  })
);
