import { VercelRequest } from '@vercel/node';
import { getValidDexcomSession } from './dexcomSession';
import { DexcomRequestContext } from '../types';
import { rateLimit } from './rateLimit';

const withDexcomSession = async (
  req: VercelRequest
): Promise<DexcomRequestContext> => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    const err = new Error('Missing session');
    (err as any).code = 'SESSION_NOT_FOUND';
    throw err;
  }
  const sessionId = auth.replace('Bearer ', '');

  const { remaining, resetIn } = await rateLimit(sessionId);

  // const { start, end } = req.query;
  // if (!start || !end) {
  //   const err = new Error('Missing date range');
  //   (err as any).code = 'INVALID_DATE_RANGE';
  //   throw err;
  // }

  // const startDate = new Date(start as string);
  // const endDate = new Date(end as string);

  // if (
  //   isNaN(startDate.getTime()) ||
  //   isNaN(endDate.getTime()) ||
  //   startDate >= endDate
  // ) {
  //   const err = new Error('Invalid date range');
  //   (err as any).code = 'INVALID_DATE_RANGE';
  //   throw err;
  // }

  // if (
  //   isNaN(startDate.getTime()) ||
  //   isNaN(endDate.getTime()) ||
  //   startDate >= endDate
  // ) {
  //   const err = new Error('Invalid date range');
  //   (err as any).code = 'INVALID_DATE_RANGE';
  //   throw err;
  // }

  const now = new Date();

  const endDate = now;
  const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const { accessToken, sessionId: newSessionId } =
    await getValidDexcomSession(sessionId);

  return {
    accessToken,
    sessionId: newSessionId,
    start: startDate,
    end: endDate,
    rateLimit: {
      remaining,
      resetIn,
    },
  };
};

export { withDexcomSession };
