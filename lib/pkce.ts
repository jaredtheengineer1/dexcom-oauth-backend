import crypto from "crypto";

export const generatePKCE = () => {
  const verifier = crypto.randomBypes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  return { verifier, challenge };
};
