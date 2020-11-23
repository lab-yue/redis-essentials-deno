import {
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { redis, withKeys } from "./index.ts";

Deno.test(
  "sets",
  withKeys(["favoriteA", "favoriteB"], async (favoriteA, favoriteB) => {
    assertEquals(
      await redis.sadd(
        favoriteA,
        "Arcade Fire",
        "Arctic Monkeys",
        "Belle & Sebastian",
        "Lenine"
      ),
      4
    );
    assertEquals(
      await redis.sadd(favoriteB, "Daft Punk", "The Kooks", "Arctic Monkeys"),
      3
    );
    assertEquals(await redis.sinter(favoriteA, favoriteB), ["Arctic Monkeys"]);
    assertArrayIncludes(await redis.sdiff(favoriteA, favoriteB), [
      "Arcade Fire",
      "Belle & Sebastian",
      "Lenine",
    ]);
    assertArrayIncludes(await redis.sunion(favoriteA, favoriteB), [
      "Lenine",
      "Daft Punk",
      "Belle & Sebastian",
      "Arctic Monkeys",
      "Arcade Fire",
      "The Kooks",
    ]);
    assertArrayIncludes(
      ["Arcade Fire", "Arctic Monkeys", "Belle & Sebastian", "Lenine"],
      [await redis.srandmember(favoriteA)]
    );
    assertEquals(await redis.sismember(favoriteB, "Lenine"), 0);
    assertEquals(await redis.srem(favoriteA, "Lenine"), 1);
    assertEquals(await redis.scard(favoriteA), 3);
    assertArrayIncludes(await redis.smembers(favoriteA), [
      "Arcade Fire",
      "Arctic Monkeys",
      "Belle & Sebastian",
    ]);
  })
);
