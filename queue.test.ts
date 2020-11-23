import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { redis } from "./index.ts";

const queue = (name: string) => {
  const key = `queue:${name}`;
  const timeout = 0;

  return {
    queue: name,
    key,
    timeout,
    async size() {
      return redis.llen(key);
    },
    async push(data: string) {
      return redis.lpush(key, data);
    },
    async pop() {
      return redis.brpop(timeout, key);
    },
    async clear() {
      return redis.del(key);
    },
  };
};

const producer = (Q: ReturnType<typeof queue>) => ({
  async run(size: number) {
    [...Array(size).keys()].forEach((i) => {
      const log = `Hello ${i}`;
      console.log(`[producer] Append log: ${log}`);
      Q.push(log);
    });
  },
});

const consumer = (Q: ReturnType<typeof queue>) => ({
  async run() {
    while (await Q.size()) {
      const [_, value] = await Q.pop();
      console.log(`[consumer] Got log: ${value}`);
    }
  },
});

Deno.test("queue", async () => {
  const Q = queue("log");
  await Promise.all([producer(Q).run(5), consumer(Q).run()]);
  assertEquals(await Q.size(), 0);
  await Q.clear();
});
