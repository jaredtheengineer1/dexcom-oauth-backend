import axios from 'axios';
import { kv } from '@vercel/kv';
import { DexcomSession, ValidDexcomSession } from '../types';
import { THIRTY_DAYS_SECONDS, REFRESH_BUFFER_MS } from '../constants';
import { encrypt, decrypt } from './crypto';

const TTL = THIRTY_DAYS_SECONDS;

export const getValidDexcomSession = async (
  sessionId: string
): Promise<ValidDexcomSession> => {
  const key = `dexcom:${sessionId}`;
  const encrypted = await kv.get<any>(key);

  if (!encrypted) {
    const err = new Error('SESSION_EXPIRED');
    (err as any).code = 'SESSION_EXPIRED';
    throw err;
  }
  let session: DexcomSession;
  try {
    session = await decrypt<DexcomSession>(encrypted);
  } catch {
    const err = new Error('SESSION_EXPIRED');
    (err as any).code = 'SESSION_EXPIRED';
    throw err;
  }

  if (!session) {
    const err = new Error('SESSION_NOT_FOUND');
    (err as any).code = 'SESSION_NOT_FOUND';
    throw err;
  }

  const expiresAt = session.accessTokenExpiresAt;
  const now = Date.now();

  if (expiresAt - now > REFRESH_BUFFER_MS) {
    return {
      accessToken: session.accessToken,
      sessionId: sessionId,
    };
  }

  const res = await axios
    .post(
      process.env.DEXCOM_TOKEN_URL!,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: session.refreshToken,
        client_id: process.env.DEXCOM_CLIENT_ID!,
        client_secret: process.env.DEXCOM_CLIENT_SECRET!,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    )
    .catch((e) => {
      const err = new Error('TOKEN_REFRESH_FAILED');
      (err as any).code = 'TOKEN_REFRESH_FAILED';
      throw err;
    });

  const updated: DexcomSession = {
    accessToken: res.data.access_token,
    refreshToken: res.data.refresh_token,
    accessTokenExpiresAt: Date.now() + res.data.expires_in * 1000,
  };

  const newSessionId = crypto.randomUUID();

  await kv.set(`dexcom:${newSessionId}`, encrypt(updated), { ex: TTL });
  await kv.del(key);
  return { accessToken: updated.accessToken, sessionId: newSessionId };
};
