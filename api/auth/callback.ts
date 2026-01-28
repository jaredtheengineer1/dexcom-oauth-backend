import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { decodeState } from "../../lib/state";

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Missing code or state");
  }

  const { verifier } = decodeState<{ verifier: string }>(state as string);

  const tokenRes = await axios.post(
    process.env.DEXCOM_TOKEN_URL!,
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.DEXCOM_CLIENT_ID!,
      client_secret: process.env.DEXCOM_CLIENT_SECRET!,
      code: code as string,
      redirect_url: `${process.env.BASE_URL}/api/auth/callback`,
      code_verifier: verifier,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );

  const shortToken = Buffer.from(JSON.stringify(tokenRes.data)).toString(
    "base64url",
  );

  const redirect = `${process.env.APP_SCHEME}://auth-complete?session=${shortToken}`;

  res.redirect(redirect);
};

export default handler;
