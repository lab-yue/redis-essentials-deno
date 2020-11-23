import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { redis, createClient, withKeys } from "./index.ts";

Deno.test(
  "pubsub",
  withKeys(["channel"], async (channelName) => {
    const pub = await createClient();
    const sub = await redis.subscribe(channelName);
    await pub.publish(channelName, "message");
    for await (const { channel, message } of sub.receive()) {
      assertEquals(message, "message");
      assertEquals(channel, channelName);
      break;
    }
    pub.close();
    await sub.unsubscribe(channelName);
  })
);
