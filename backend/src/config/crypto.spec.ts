import { describe, expect, it } from 'vitest';

import { encrypt, decrypt, CipherError, DecipherError } from '@/config/crypto';

const validKey = '%ijCr9WdSF5i7YR@URsoiZ$2n4pdFA4g';
const invalidKey = 'invalid_key';

describe('crypto', () => {
  describe('encrypt', () => {
    it('should return a non-empty encrypted string given valid input and key', () => {
      const input = 'Hello, World!';
      const result = encrypt(input, validKey);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw an error if the key length is invalid', () => {
      const input = 'Hello, World!';

      expect(() => encrypt(input, invalidKey)).toThrowError(new CipherError());
    });

    it('should throw an error if the input is empty', () => {
      const input = '';
      expect(() => encrypt(input, validKey)).toThrowError(
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

  describe('decrypt', () => {
    const message = 'Hello, World!';

    it('should correctly decrypt an encrypted message', () => {
      const encryptedMessage = encrypt(message, validKey);
      const result = decrypt(encryptedMessage, validKey);
      expect(result).toBe(message);
    });

    it('should throw an error for invalid encrypted format input', () => {
      const invalidInput = 'invalid:data';
      expect(() => decrypt(invalidInput, validKey)).toThrowError(
        new DecipherError()
      );
    });

    it('should throw an error if the key is invalid', () => {
      const encryptedMessage = encrypt(message, validKey);

      expect(() => decrypt(encryptedMessage, invalidKey)).toThrowError(
        new DecipherError()
      );
    });

    it('should throw an error if the auth tag is tampered', () => {
      const encryptedMessage = encrypt(message, validKey);
      const tamperedMessage = encryptedMessage.replace(
        /:[a-f0-9]{32}$/,
        ':ffffffffffffffffffffffffffffffff'
      );
      expect(() => decrypt(tamperedMessage, validKey)).toThrowError(
        new DecipherError()
      );
    });

    it('should throw an error if the IV is tampered', () => {
      const encryptedMessage = encrypt(message, validKey);
      const tamperedMessage = encryptedMessage.replace(
        /^[a-f0-9]{24}/,
        '000000000000000000000000'
      );
      expect(() => decrypt(tamperedMessage, validKey)).toThrowError(
        new DecipherError()
      );
    });

    it('should throw an error if the input is empty', () => {
      const input = '';
      expect(() => decrypt(input, validKey)).toThrowError(
        new ReferenceError("Can't decrypt empty string")
      );
    });

    it('should throw an error if the key is empty', () => {
      const input = 'Hello world';
      expect(() => decrypt(input, '')).toThrowError(
        new ReferenceError("Can't decrypt without key")
      );
    });
  });
});
