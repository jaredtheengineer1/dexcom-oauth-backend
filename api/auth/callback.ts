import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { decodeState } from "../../lib/state";
import { kv } from "@vercel/kv";
import { DexcomSession } from "../../types";
import { FIVE_MINUTES, THIRTY_DAYS_SECONDS } from "../../constants";

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Missing code or state");
  }

  const { verifier, ts } = decodeState<{ verifier: string; ts: number }>(
    state as string,
  );

  if (Date.now() - ts > FIVE_MINUTES) {
    return res.status(400).send("State expired");
  }

  try {
    const tokenRes = await axios.post(
      process.env.DEXCOM_TOKEN_URL!,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.DEXCOM_CLIENT_ID!,
        client_secret: process.env.DEXCOM_CLIENT_SECRET!,
        code: code as string,
        redirect_uri: `${process.env.DEXCOM_REDIRECT_URI}/api/auth/callback`,
        code_verifier: verifier,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const sessionId = crypto.randomUUID();
    const session: DexcomSession = {
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
      accessTokenExpiresAt: Date.now() + tokenRes.data.expires_in * 1000,
    };

    await kv.set<DexcomSession>(`dexcom:${sessionId}`, session, {
      ex: THIRTY_DAYS_SECONDS,
    });

    const redirect = `${process.env.APP_SCHEME}://auth-complete?session=${sessionId}`;

    res.redirect(redirect);
  } catch (err: any) {
    console.error("TOKEN ERROR STATUS:", err.response?.status);
    console.error("TOKEN ERROR DATA:", err.response?.data);
    console.error("TOKEN ERROR HEADERS:", err.response?.headers);
    res.status(500).send("Token exchange failed");
  }
};

export default handler;
