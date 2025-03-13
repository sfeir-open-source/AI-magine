import { EncryptionService } from './encryption.service';
import { ConfigurationService } from '@/configuration/configuration.service';
import { ConfigService } from '@nestjs/config';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const encryptedEmail = 'a2faea01f6de2bf326183529934d3d2b';
  const clearEmail = 'email@test.com';

  beforeEach(async () => {
    service = new EncryptionService(
      new ConfigurationService({
        get: (key: string) => process.env[key],
      } as unknown as ConfigService)
    );
  });

  describe('encryptEmail', () => {
    it('should return a non-empty encrypted string given valid input and key', () => {
      const result = service.encryptEmail(clearEmail);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toBe(encryptedEmail);
    });

    it('should throw an error if the input is empty', async () => {
      expect(() => service.encryptEmail('')).toThrowError(
        new ReferenceError("Can't encrypt empty string")
      );
    });

    it('should throw an error if the key or iv are empty', () => {
      const oldKey = process.env.EMAIL_ENCRYPTION_KEY;
      process.env.EMAIL_ENCRYPTION_KEY = '';

      expect(() => service.encryptEmail(clearEmail)).toThrowError(
        new ReferenceError('Encryption key and IV must be set')
      );

      process.env.EMAIL_ENCRYPTION_KEY = oldKey;
      const oldIv = process.env.EMAIL_ENCRYPTION_IV;
      process.env.EMAIL_ENCRYPTION_IV = '';

      expect(() => service.encryptEmail(clearEmail)).toThrowError(
        new ReferenceError('Encryption key and IV must be set')
      );

      process.env.EMAIL_ENCRYPTION_IV = oldIv;
    });
  });

  describe('decryptEmail', () => {
    it('should return a non-empty decrypted string given valid input and key', () => {
      const result = service.decryptEmail(encryptedEmail);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toBe(clearEmail);
    });

    it('should throw an error if the input is empty', async () => {
      expect(() => service.decryptEmail('')).toThrowError(
        new ReferenceError("Can't decrypt empty string")
      );
    });

    it('should throw an error if the key or iv are empty', () => {
      const oldKey = process.env.EMAIL_ENCRYPTION_KEY;
      process.env.EMAIL_ENCRYPTION_KEY = '';

      expect(() => service.decryptEmail(clearEmail)).toThrowError(
        new ReferenceError('Encryption key and IV must be set')
      );

      process.env.EMAIL_ENCRYPTION_KEY = oldKey;
      const oldIv = process.env.EMAIL_ENCRYPTION_IV;
      process.env.EMAIL_ENCRYPTION_IV = '';

      expect(() => service.decryptEmail(clearEmail)).toThrowError(
        new ReferenceError('Encryption key and IV must be set')
      );

      process.env.EMAIL_ENCRYPTION_IV = oldIv;
    });
  });
});
