import { encrypt } from '@/config/crypto';

const validKey = '%ijCr9WdSF5i7YR@URsoiZ$2n4pdFA4g';

describe('crypto', () => {
  describe('encrypt', () => {
    it('should return a non-empty encrypted string given valid input and key', async () => {
      const input = 'Hello, World!';
      const result = await encrypt(input, validKey);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw an error if the input is empty', async () => {
      expect(() => encrypt('', validKey)).toThrowError(
        new ReferenceError("Can't encrypt empty string")
      );
    });

    it('should throw an error if the key is empty', () => {
      const input = 'Hello world';
      expect(() => encrypt(input, '')).toThrowError(
        new ReferenceError("Can't encrypt without key")
      );
    });
  });
});
