import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.78.0/async/delay.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

Deno.test(
  "get set",
  withKeys(["k"], async (key) => {
    assertEquals(await redis.set(key, "v"), "OK");
    assertEquals(await redis.get(key), "v");
  })
);

Deno.test(
  "mget mset",
  withKeys(["a", "b"], async (a, b) => {
    assertEquals(await redis.mset({ a, b }), "OK");
    assertEquals(await redis.mget(a, b), ["a", "b"]);
  })
);

Deno.test(
  "delay and ttl",
  withKeys(["delay"], async (key) => {
    assertEquals(await redis.set(key, "delay"), "OK");
    assertEquals(await redis.ttl(key), -1);
    assertEquals(await redis.expire(key, 2), 1);
    assertEquals(await redis.get(key), "delay");
    assertEquals((await redis.ttl(key)) > 0, true);
    await delay(2000);

    assertEquals(await redis.get(key), undefined);
    assertEquals(await redis.ttl(key), -2);
    assertEquals(await redis.expire(key, 2), 0);
  })
);

Deno.test(
  "incr and decr",
  withKeys(["num"], async (key) => {
    assertEquals(await redis.incr(key), 1);
    assertEquals(await redis.incrby(key, 4), 5);
    assertEquals(await redis.decr(key), 4);
    assertEquals(await redis.decrby(key, 3), 1);
    assertEquals(await redis.incrbyfloat(key, 98.9), "99.9");
  })
);

function withKeys(args: string[], fn: (...args: string[]) => unknown) {
  return async () => {
    await fn(...args);
    await redis.del(...args);
  };
}
