import { describe, expect, it, vi } from 'vitest';
import { User } from '@/user/user-types/user.domain';

vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-id-1234567890123456789012',
}));

describe('User Class', () => {
  describe('from Method', () => {
    it('should create a User instance with all required fields', () => {
      const user = User.from('1', 'hashedEmail', 'fingerprint', true);
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('1');
      expect(user.hashedEmail).toBe('hashedEmail');
      expect(user.browserFingerprint).toBe('fingerprint');
      expect(user.allowContact).toBe(true);
    });

    it('should create a User instance with optional fields', () => {
      const user = User.from(
        '1',
        'hashedEmail',
        'fingerprint',
        false,
        'John Doe',
        'Developer'
      );
      expect(user.name).toBe('John Doe');
      expect(user.jobTitle).toBe('Developer');
    });

    it('should throw an error if required fields are missing', () => {
      expect(() =>
        User.from('', 'hashedEmail', 'fingerprint', true)
      ).toThrowError('Id is required');
      expect(() => User.from('1', '', 'fingerprint', true)).toThrowError(
        'Email is required'
      );
      expect(() => User.from('1', 'hashedEmail', '', true)).toThrowError(
        'Browser fingerprint is required'
      );
    });
  });

  describe('create Method', () => {
    it('should create a User instance with a generated id', () => {
      const user = User.create('hashedEmail', 'fingerprint', true);
      expect(user).toBeInstanceOf(User);
      expect(user.id).toHaveLength(32);
      expect(user.id).toEqual('mocked-id-1234567890123456789012');
      expect(user.hashedEmail).toBe('hashedEmail');
      expect(user.browserFingerprint).toBe('fingerprint');
      expect(user.allowContact).toBe(true);
    });

    it('should create a User instance with optional fields', () => {
      const user = User.create(
        'hashedEmail',
        'fingerprint',
        false,
        'Jane Doe',
        'Designer'
      );
      expect(user.name).toBe('Jane Doe');
      expect(user.jobTitle).toBe('Designer');
    });

    it('should throw an error if required fields are missing', () => {
      expect(() => User.create('', 'fingerprint', true)).toThrowError(
        'Email is required'
      );
      expect(() => User.create('hashedEmail', '', true)).toThrowError(
        'Browser fingerprint is required'
      );
    });
  });
});
