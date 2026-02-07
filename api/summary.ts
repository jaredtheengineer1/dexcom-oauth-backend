import { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizeEgvs } from '../lib/summary';
import { fetchEgvsRange } from '../lib/egvs';
import { handleApiErrors } from '../lib/errors';
import { DexcomRequestContext } from '../types';
import { withDexcomSession } from '../lib/withDexcomSession';
import { setHeaders } from '../lib/setHeaders';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const ctx: DexcomRequestContext = await withDexcomSession(req);

    const egvsData = await fetchEgvsRange(
      ctx.accessToken,
      ctx.start as Date,
      ctx.end as Date
    );

    const data = summarizeEgvs(egvsData);
    setHeaders(res, ctx);
    res.json(data);
  } catch (err: any) {
    return handleApiErrors(err, res);
  }
};

export default handler;
