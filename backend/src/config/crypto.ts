import * as crypto from 'node:crypto';

export const encrypt = (input: string, key: string): string => {
  if (!input) {
    throw new ReferenceError("Can't encrypt empty string");
  }
  if (!key) {
    throw new ReferenceError("Can't encrypt without key");
  }

  return crypto.createHmac('sha256', key).update(input).digest('hex');
};
