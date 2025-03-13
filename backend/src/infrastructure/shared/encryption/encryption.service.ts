import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ConfigurationService } from '@/configuration/configuration.service';

@Injectable()
export class EncryptionService {
  private ALGORITHM = 'aes-256-cbc';

  constructor(
    @Inject() private readonly configurationService: ConfigurationService
  ) {}

  private getKeyAndIv() {
    const key = this.configurationService.getEmailEncryptionKey();
    const iv = this.configurationService.getEmailEncryptionIV();
    if (!key || !iv) {
      throw new ReferenceError('Encryption key and IV must be set');
    }
    return {
      key: Buffer.from(key, 'hex'),
      iv: Buffer.from(iv, 'hex'),
    };
  }

  encryptEmail(email: string) {
    if (!email) {
      throw new ReferenceError("Can't encrypt empty string");
    }

    const { key, iv } = this.getKeyAndIv();

    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    let encrypted = cipher.update(email, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptEmail(encryptedEmail: string): string {
    if (!encryptedEmail) {
      throw new ReferenceError("Can't decrypt empty string");
    }

    const { key, iv } = this.getKeyAndIv();
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedEmail, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
