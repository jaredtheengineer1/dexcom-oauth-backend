export const encodeState = (data: object) => {
  return Buffer.from(JSON.stringify(data)).toString("base64url");
};

export const decodeState = <T>(state: string): T => {
  return JSON.parse(Buffer.from(state, "base64url").toString());
};
