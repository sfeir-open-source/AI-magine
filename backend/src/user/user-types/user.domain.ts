import { nanoid } from 'nanoid';

export class User {
  id: string;
  name?: string;
  hashedEmail: string;
  browserFingerprint: string;
  jobTitle?: string;
  allowContact: boolean;

  private constructor(
    id: string,
    hashedEmail: string,
    browserFingerprint: string,
    allowContact: boolean,
    name?: string,
    jobTitle?: string
  ) {
    if (!id) throw new Error('Id is required');
    if (!hashedEmail) throw new Error('Email is required');
    if (!browserFingerprint) throw new Error('Browser fingerprint is required');

    this.id = id;
    this.name = name;
    this.hashedEmail = hashedEmail;
    this.browserFingerprint = browserFingerprint;
    this.jobTitle = jobTitle;
    this.allowContact = allowContact;
  }

  static from(
    id: string,
    hashedEmail: string,
    browserFingerprint: string,
    allowContact: boolean,
    name?: string,
    jobTitle?: string
  ) {
    return new User(
      id,
      hashedEmail,
      browserFingerprint,
      allowContact,
      name,
      jobTitle
    );
  }

  static create(
    hashedEmail: string,
    browserFingerprint: string,
    allowContact: boolean,
    name?: string,
    jobTitle?: string
  ) {
    return new User(
      nanoid(32),
      hashedEmail,
      browserFingerprint,
      allowContact,
      name,
      jobTitle
    );
  }
}
