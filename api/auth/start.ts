import { VercelRequest, VercelResponse } from "@vercel/node";
import { generatePKCE } from "../../lib/pkce";
import { encodeState } from "../../lib/state";

export const handler = (req: VercelRequest, res: VercelResponse) => {
  const { challenge, verifier } = generatePKCE();

  const state = encodeState({
    verifier,
    ts: Date.now(),
  });

  const params = new URLSearchParams({
    client_id: process.env.DEXCOM_CLIENT_ID!,
    redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
    response_type: "code",
    scope: "egvs offline_access",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  res.redirect(`${process.env.DEXCOM_AUTH_URL}?${params.toString()}`);
};

export default handler;
