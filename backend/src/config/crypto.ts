import * as crypto from 'node:crypto';

export class CipherError extends Error {
  message = 'Cipher error';
}
export class DecipherError extends Error {
  message = 'Decipher error';
}

export const encrypt = (input: string, key: string): string => {
  if (!input) {
    throw new ReferenceError("Can't encrypt empty string");
  }
  if (!key) {
    throw new ReferenceError("Can't encrypt without key");
  }
  try {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(input, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch {
    throw new CipherError();
  }
};

export const decrypt = (input: string, key: string): string => {
  if (!input) {
    throw new ReferenceError("Can't decrypt empty string");
  }
  if (!key) {
    throw new ReferenceError("Can't decrypt without key");
  }
  try {
    const [iv, encrypted, authTag] = input.split(':');

    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch {
    throw new DecipherError();
  }
};
