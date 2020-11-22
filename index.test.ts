import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.78.0/async/delay.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

Deno.test("get set", async () => {
  assertEquals(await redis.set("k", "v"), "OK");
  assertEquals(await redis.get("k"), "v");
});

Deno.test("mget mset", async () => {
  assertEquals(await redis.mset({ a: "a", b: "b" }), "OK");
  assertEquals(await redis.mget("a", "b"), ["a", "b"]);
});

Deno.test("delay and ttl", async () => {
  assertEquals(await redis.set("delayK", "delayV"), "OK");
  assertEquals(await redis.ttl("delayK"), -1);
  assertEquals(await redis.expire("delayK", 2), 1);
  assertEquals(await redis.get("delayK"), "delayV");
  assertEquals((await redis.ttl("delayK")) > 0, true);
  await delay(2000);

  assertEquals(await redis.get("delayK"), undefined);
  assertEquals(await redis.ttl("delayK"), -2);
  assertEquals(await redis.expire("delayK", 2), 0);
});
