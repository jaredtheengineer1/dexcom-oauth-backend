import { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizeEgvs } from '../lib/summary';
import { fetchEgvs } from '../lib/egvs';
import { apiError } from '../lib/errors';
import { DexcomRequestContext } from '../types';
import { withDexcomSession } from '../lib/withDexcomSession';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const ctx: DexcomRequestContext = await withDexcomSession(req);

    const egvsData = await fetchEgvs(ctx.accessToken, ctx.start, ctx.end);

    const data = summarizeEgvs(egvsData);
    res.setHeader('X-Session-Rotate', ctx.sessionId);
    res.json(data);
  } catch (err: any) {
    if (
      err.code === 'SESSION_NOT_FOUND' ||
      err.code === 'TOKEN_REFRESH_FAILED'
    ) {
      return apiError(res, 401, err.code);
    }

    if (err.code === 'RATE_LIMITED') {
      return apiError(res, 429, err.code);
    }

    console.error(err);
    return apiError(res, 500, 'DEXCOM_ERROR');
  }
};

export default handler;
