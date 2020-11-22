import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

Deno.test("get set", async () => {
  const ok = await redis.set("k", "v");
  assertEquals(ok, "OK");
  const v = await redis.get("k");
  assertEquals(v, "v");
});
