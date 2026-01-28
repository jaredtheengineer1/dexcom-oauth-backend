import { VercelRequest, VercelResponse } from "@vercel/node";
import { generatePKCE } from "../../lib/pkce";
import { encodeState } from "../../lib/state";

export const handler = (req: VercelRequest, res: VercelResponse) => {
  console.log("AUTH START");
  console.log({
    clientId: process.env.DEXCOM_CLIENT_ID,
    redirectUri: process.env.DEXCOM_REDIRECT_URI,
    authUrl: process.env.DEXCOM_AUTH_URL,
  });
  const { challenge, verifier } = generatePKCE();

  const state = encodeState({
    verifier,
    ts: Date.now(),
  });

  console.log("STATE: ", state);

  const params = new URLSearchParams({
    client_id: process.env.DEXCOM_CLIENT_ID!,
    redirect_uri: `${process.env.DEXCOM_REDIRECT_URI}/api/auth/callback`,
    response_type: "code",
    scope: "egvs offline_access",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  console.log(
    "REDIRECTING TO:",
    `${process.env.DEXCOM_AUTH_URL}?${params.toString()}`,
  );

  res.redirect(`${process.env.DEXCOM_AUTH_URL}?${params.toString()}`);
};

export default handler;
