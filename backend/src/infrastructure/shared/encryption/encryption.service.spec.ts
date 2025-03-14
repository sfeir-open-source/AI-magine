import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  describe('encryptEmail', () => {
    const email = 'email@test.com';

    it('should return a non-empty encrypted string given valid input and key', () => {
      const result = service.encryptEmail(email);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw an error if the input is empty', async () => {
      expect(() => service.encryptEmail('')).toThrowError(
        new ReferenceError("Can't encrypt empty string")
      );
    });

    it('should throw an error if the key is empty', () => {
      const oldKey = process.env.EMAIL_HASH_SECRET;
      process.env.EMAIL_HASH_SECRET = '';

      expect(() => service.encryptEmail(email)).toThrowError(
        new ReferenceError("Can't encrypt without key")
      );

      process.env.EMAIL_HASH_SECRET = oldKey;
    });
  });
});
