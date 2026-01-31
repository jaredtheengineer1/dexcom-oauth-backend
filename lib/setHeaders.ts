import { VercelResponse } from '@vercel/node';
import { DexcomRequestContext } from '../types';
import { MAX_REQUESTS } from '../constants';

const setHeaders = (res: VercelResponse, ctx: DexcomRequestContext) => {
  res.setHeader('X-Session-Rotate', ctx.sessionId);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', ctx.rateLimit.remaining);
  res.setHeader(
    'X-RateLimit-Reset',
    Math.floor(Date.now() / 1000) + ctx.rateLimit.resetIn
  );
};

export { setHeaders };
