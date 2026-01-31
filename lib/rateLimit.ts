import { kv } from "@vercel/kv";
import { WINDOW_SECONDS, MAX_REQUESTS } from "../constants";

const rateLimit = async (key: string) => {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rate:${key}:${Math.floor(now / WINDOW_SECONDS)}`;

  const count = await kv.incr(windowKey);

  if (count === 1) {
    //this is the first request in this window
    await kv.expire(windowKey, WINDOW_SECONDS);
  }

  if (count > MAX_REQUESTS) {
    const err = new Error("RATE_LIMITED");
    (err as any).code = "RATE_LIMITED";
    throw err;
  }
};

export { rateLimit };
