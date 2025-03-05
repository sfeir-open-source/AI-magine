import { nanoid } from 'nanoid';

export class User {
  id: string;
  nickname: string;
  hashedEmail: string;
  browserFingerprint: string;
  allowContact: boolean;

  private constructor(
    id: string,
    hashedEmail: string,
    browserFingerprint: string,
    allowContact: boolean,
    nickname: string
  ) {
    if (!id) throw new Error('Id is required');
    if (!hashedEmail) throw new Error('Email is required');
    if (!browserFingerprint) throw new Error('Browser fingerprint is required');
    if (!nickname) throw new Error('Nickname is required');

    this.id = id;
    this.nickname = nickname;
    this.hashedEmail = hashedEmail;
    this.browserFingerprint = browserFingerprint;
    this.allowContact = allowContact;
  }

  static from(
    id: string,
    hashedEmail: string,
    browserFingerprint: string,
    allowContact: boolean,
    nickname: string
  ) {
    return new User(
      id,
      hashedEmail,
      browserFingerprint,
      allowContact,
      nickname
    );
  }

  static create(
    hashedEmail: string,
    browserFingerprint: string,
    allowContact: boolean,
    nickname: string
  ) {
    return new User(
      nanoid(32),
      hashedEmail,
      browserFingerprint,
      allowContact,
      nickname
    );
  }
}
