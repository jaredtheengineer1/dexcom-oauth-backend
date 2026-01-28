import { VercelRequest, VercelResponse } from "@vercel/node";

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { session } = req.body;

  if (!session) {
    return res.status(400).json({ error: "Missing session" });
  }

  const decoded = JSON.parse(Buffer.from(session, "base64url").toString());

  res.json(decoded);
};
