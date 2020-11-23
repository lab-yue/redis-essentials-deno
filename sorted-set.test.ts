import {
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { red } from "https://deno.land/std@0.78.0/fmt/colors.ts";
import { redis, withKeys } from "./index.ts";

Deno.test(
  "sorted set",
  withKeys(["leaders"], async (leaders) => {
    assertEquals(
      await redis.zadd(leaders, [
        [100, "Alice"],
        [100, "Zed"],
        [102, "Hugo"],
        [101, "Max"],
      ]),
      4
    );
    assertEquals(await redis.zrevrange(leaders, 0, -1, { with_score: true }), [
      "Hugo",
      "102",
      "Max",
      "101",
      "Zed",
      "100",
      "Alice",
      "100",
    ]);
    assertEquals(await redis.zrem(leaders, "Hugo"), 1);
    assertArrayIncludes(await redis.zrange(leaders, 0, -1), [
      "Zed",
      "Alice", // this two rank could be random
      "Max", // this two rank could be random
    ]);
    assertEquals(await redis.zscore(leaders, "Zed"), "100");
    assertEquals(await redis.zrevrank(leaders, "Alice"), 2);
  })
);
