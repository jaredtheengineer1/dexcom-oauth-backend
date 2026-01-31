import { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizeEgvs } from '../lib/summary';
import { fetchEgvs } from '../lib/egvs';
import { handleApiErrors } from '../lib/errors';
import { DexcomRequestContext } from '../types';
import { withDexcomSession } from '../lib/withDexcomSession';
import { MAX_REQUESTS } from '../constants';
import { setHeaders } from '../lib/setHeaders';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const ctx: DexcomRequestContext = await withDexcomSession(req);

    const egvsData = await fetchEgvs(ctx.accessToken, ctx.start, ctx.end);

    const data = summarizeEgvs(egvsData);
    setHeaders(res, ctx);
    res.json(data);
  } catch (err: any) {
    return handleApiErrors(err, res);
  }
};

export default handler;
