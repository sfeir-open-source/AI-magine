import { describe, expect, it, vi } from 'vitest';
import { User } from '@/user/user-types/user.domain';

vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-id-1234567890123456789012',
}));

describe('User Class', () => {
  describe('from Method', () => {
    it('should create a User instance with all required fields', () => {
      const user = User.from(
        '1',
        'hashedEmail',
        'fingerprint',
        true,
        'nickname'
      );
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('1');
      expect(user.hashedEmail).toBe('hashedEmail');
      expect(user.browserFingerprint).toBe('fingerprint');
      expect(user.allowContact).toBe(true);
      expect(user.nickname).toBe('nickname');
    });

    it('should create a User instance with optional fields', () => {
      const user = User.from(
        '1',
        'hashedEmail',
        'fingerprint',
        false,
        'John Doe'
      );
      expect(user.nickname).toBe('John Doe');
    });

    it('should throw an error if required fields are missing', () => {
      expect(() =>
        User.from('', 'hashedEmail', 'fingerprint', true, 'nickname')
      ).toThrowError('Id is required');
      expect(() =>
        User.from('1', '', 'fingerprint', true, 'nickname')
      ).toThrowError('Email is required');
      expect(() =>
        User.from('1', 'hashedEmail', '', true, 'nickname')
      ).toThrowError('Browser fingerprint is required');
    });
  });

  describe('create Method', () => {
    it('should create a User instance with a generated id', () => {
      const user = User.create('hashedEmail', 'fingerprint', true, 'nickname');
      expect(user).toBeInstanceOf(User);
      expect(user.id).toHaveLength(32);
      expect(user.id).toEqual('mocked-id-1234567890123456789012');
      expect(user.hashedEmail).toBe('hashedEmail');
      expect(user.browserFingerprint).toBe('fingerprint');
      expect(user.allowContact).toBe(true);
      expect(user.nickname).toBe('nickname');
    });

    it('should create a User instance with optional fields', () => {
      const user = User.create('hashedEmail', 'fingerprint', false, 'Jane Doe');
      expect(user.nickname).toBe('Jane Doe');
    });

    it('should throw an error if required fields are missing', () => {
      expect(() =>
        User.create('', 'fingerprint', true, 'nickname')
      ).toThrowError('Email is required');
      expect(() =>
        User.create('hashedEmail', '', true, 'nickname')
      ).toThrowError('Browser fingerprint is required');
    });
  });
});
