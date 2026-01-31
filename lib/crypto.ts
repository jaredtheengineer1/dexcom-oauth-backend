import crypto from 'crypto';
import { ALGO, IV_LENGTH } from '../constants';
import { EncryptedPayload } from '../types';

const key = Buffer.from(process.env.KV_ENCRYPTION_KEY!, 'base64');

const encrypt = (value: unknown): EncryptedPayload => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const json = JSON.stringify(value);
  const encrypted = Buffer.concat([
    cipher.update(json, 'utf8'),
    cipher.final(),
  ]);

  return {
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: encrypted.toString('base64'),
  };
};

const decrypt = <T>(payload: EncryptedPayload): T => {
  const decipher = crypto.createDecipheriv(
    ALGO,
    key,
    Buffer.from(payload.iv, 'base64')
  );

  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('base64'));
};

export { encrypt, decrypt };
