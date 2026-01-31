import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchEgvs } from '../lib/egvs';
import { handleApiErrors } from '../lib/errors';
import { withDexcomSession } from '../lib/withDexcomSession';
import { DexcomRequestContext } from '../types';
import { setHeaders } from '../lib/setHeaders';

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const ctx: DexcomRequestContext = await withDexcomSession(req);

    const data = await fetchEgvs(ctx.accessToken, ctx.start, ctx.end);
    setHeaders(res, ctx);
    res.json(data);
  } catch (err: any) {
    return handleApiErrors(err, res);
  }
};

export default handler;
