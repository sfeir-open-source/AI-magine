import { describe, expect, it, vi } from 'vitest';
import { User } from '@/user/domain/user.domain';

vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-id-1234567890123456789012',
}));

describe('User Class', () => {
  describe('from Method', () => {
    it('should create a User instance with all required fields', () => {
      const user = User.from({
        id: '1',
        email: 'email',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: 'nickname',
      });
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('1');
      expect(user.email).toBe('email');
      expect(user.browserFingerprint).toBe('fingerprint');
      expect(user.allowContact).toBe(true);
      expect(user.nickname).toBe('nickname');
    });

    it('should throw an error if required fields are missing', () => {
      expect(() =>
        User.from({
          id: '',
          email: 'email',
          browserFingerprint: 'fingerprint',
          allowContact: true,
          nickname: 'nickname',
        })
      ).toThrowError('Id is required');
      expect(() =>
        User.from({
          id: '1',
          email: '',
          browserFingerprint: 'fingerprint',
          allowContact: true,
          nickname: 'nickname',
        })
      ).toThrowError('Email is required');
      expect(() =>
        User.from({
          id: '1',
          email: 'email',
          browserFingerprint: '',
          allowContact: true,
          nickname: 'nickname',
        })
      ).toThrowError('Browser fingerprint is required');
    });
    expect(() =>
      User.from({
        id: '1',
        email: 'email',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: '',
      })
    ).toThrowError('Nickname is required');
  });
});

describe('create Method', () => {
  it('should create a User instance with a generated id', () => {
    const user = User.create({
      email: 'email',
      browserFingerprint: 'fingerprint',
      allowContact: true,
      nickname: 'nickname',
    });
    expect(user).toBeInstanceOf(User);
    expect(user.id).toHaveLength(32);
    expect(user.id).toEqual('mocked-id-1234567890123456789012');
    expect(user.email).toBe('email');
    expect(user.browserFingerprint).toBe('fingerprint');
    expect(user.allowContact).toBe(true);
    expect(user.nickname).toBe('nickname');
  });

  it('should throw an error if required fields are missing', () => {
    expect(() =>
      User.create({
        email: '',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: 'nickname',
      })
    ).toThrowError('Email is required');
    expect(() =>
      User.create({
        email: 'email',
        browserFingerprint: '',
        allowContact: true,
        nickname: 'nickname',
      })
    ).toThrowError('Browser fingerprint is required');
    expect(() =>
      User.create({
        email: 'email',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: '',
      })
    ).toThrowError('Nickname is required');
  });
});
