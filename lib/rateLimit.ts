import { kv } from '@vercel/kv';
import { WINDOW_SECONDS, MAX_REQUESTS } from '../constants';
import { RateLimitResult } from '../types';

const rateLimit = async (key: string): Promise<RateLimitResult> => {
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / WINDOW_SECONDS);
  const windowKey = `rate:${key}:${window}`;

  const count = await kv.incr(windowKey);

  if (count === 1) {
    //this is the first request in this window
    await kv.expire(windowKey, WINDOW_SECONDS);
  }

  const remaining = Math.max(0, MAX_REQUESTS - count);
  const resetIn = WINDOW_SECONDS - (now % WINDOW_SECONDS);

  if (count > MAX_REQUESTS) {
    const err: any = new Error('RATE_LIMITED');
    err.code = 'RATE_LIMITED';
    err.retryAfter = resetIn;
    err.remaining = remaining;
    throw err;
  }

  return { remaining, resetIn };
};

export { rateLimit };
