import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { red } from "https://deno.land/std@0.78.0/fmt/colors.ts";
import { redis, withKeys } from "./index.ts";

Deno.test(
  "hashes",
  withKeys(["movie"], async (movie) => {
    const title = "The Godfather";
    const year = "1972";
    const rating = "9.2";
    const watchers = "10000000";
    assertEquals(await redis.hset(movie, { title, year, rating, watchers }), 4);
    assertEquals(await redis.hincrby(movie, "watchers", 3), 10000003);
    assertEquals(await redis.hincrby(movie, "watchers", -3), 10000000);
    assertEquals(await redis.hget(movie, "title"), title);
    assertEquals(await redis.hmget(movie, "title", "year"), [title, year]);
    assertEquals(await redis.hdel(movie, "rating"), 1);
    assertEquals(await redis.hgetall(movie), [
      "title",
      title,
      "year",
      year,
      "watchers",
      watchers,
    ]);
    assertEquals(await redis.hkeys(movie), ["title", "year", "watchers"]);
    assertEquals(await redis.hvals(movie), [title, year, watchers]);
    /**
     * @see https://redis.io/commands/scan#scan-guarantees
     *
     * SCAN family functions do not guarantee that the number of elements returned per call are in a given range.
     * The commands are also allowed to return zero elements,
     * and the client should not consider the iteration complete as long as the returned cursor is not zero.
     */
    assertEquals(await redis.hscan(movie, 0), [
      "0",
      ["title", title, "year", year, "watchers", watchers],
    ]);
    assertEquals(await redis.hscan(movie, 0, { pattern: "w*" }), [
      "0",
      ["watchers", watchers],
    ]);
  })
);
