import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class EncryptionService {
  encryptEmail(email: string) {
    if (!email) {
      throw new ReferenceError("Can't encrypt empty string");
    }

    if (!process.env.EMAIL_HASH_SECRET) {
      throw new ReferenceError("Can't encrypt without key");
    }

    return crypto
      .createHmac('sha256', process.env.EMAIL_HASH_SECRET)
      .update(email)
      .digest('hex');
  }
}
