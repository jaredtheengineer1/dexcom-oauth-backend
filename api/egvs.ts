import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchEgvs } from "../lib/egvs";
import { apiError } from "../lib/errors";
import { withDexcomSession } from "../lib/withDexcomSession";
import { DexcomRequestContext } from "../types";

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const ctx: DexcomRequestContext = await withDexcomSession(req);

    const data = await fetchEgvs(ctx.accessToken, ctx.start, ctx.end);

    res.setHeader("X-Session-Rotate", ctx.sessionId);
    res.json(data);
  } catch (err: any) {
    if (
      err.code === "SESSION_NOT_FOUND" ||
      err.code === "TOKEN_REFRESH_FAILED"
    ) {
      return apiError(res, 401, err.code);
    }

    console.error(err);
    return apiError(res, 500, "DEXCOM_ERROR");
  }
};

export default handler;
