import { nanoid } from 'nanoid';

export class User {
  id: string;
  nickname: string;
  email: string;
  browserFingerprint: string;
  allowContact: boolean;

  private constructor(
    id: string,
    email: string,
    browserFingerprint: string,
    allowContact: boolean,
    nickname: string
  ) {
    if (!id) throw new Error('Id is required');
    if (!email) throw new Error('Email is required');
    if (!browserFingerprint) throw new Error('Browser fingerprint is required');
    if (!nickname) throw new Error('Nickname is required');

    this.id = id;
    this.nickname = nickname;
    this.email = email;
    this.browserFingerprint = browserFingerprint;
    this.allowContact = allowContact;
  }

  static from({
    id,
    email,
    browserFingerprint,
    allowContact,
    nickname,
  }: {
    id: string;
    email: string;
    browserFingerprint: string;
    allowContact: boolean;
    nickname: string;
  }) {
    return new User(id, email, browserFingerprint, allowContact, nickname);
  }

  static create({
    email,
    browserFingerprint,
    allowContact,
    nickname,
  }: {
    email: string;
    browserFingerprint: string;
    allowContact: boolean;
    nickname: string;
  }) {
    return new User(
      nanoid(32),
      email,
      browserFingerprint,
      allowContact,
      nickname
    );
  }
}
