import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { User, UserRepository } from '@/user/user-types';

@Injectable()
export class SqliteUserRepository
  implements UserRepository, OnApplicationBootstrap
{
  constructor(@Inject() private readonly sqliteClient: SQLiteClient) {}

  async onApplicationBootstrap() {
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS users
                  (
                      id                 TEXT PRIMARY KEY,
                      name               TEXT    NOT NULL,
                      email              TEXT    NOT NULL,
                      browserFingerprint TEXT    NOT NULL,
                      jobTitle           TEXT,
                      allowContact       BOOLEAN NOT NULL DEFAULT 1
                  );`,
    });
  }

  async getUserIdByEmail(email: string): Promise<string | undefined> {
    const storedUser = await this.sqliteClient.get<{ id: string }>({
      sql: `SELECT id
                  FROM users
                  WHERE email = ?1;`,
      params: {
        1: email,
      },
    });

    return storedUser?.id;
  }

  async save(user: User): Promise<User> {
    await this.sqliteClient.run({
      sql: `INSERT INTO users (id, name, email, browserFingerprint, jobTitle, allowContact)
                  VALUES (?1, ?2, ?3, ?4, ?5, ?6);`,
      params: {
        1: user.id,
        2: user.name,
        3: user.hashedEmail,
        4: user.browserFingerprint,
        5: user.jobTitle,
        6: user.allowContact,
      },
    });

    return user;
  }

  async checkExists(user: User): Promise<boolean> {
    const row = await this.sqliteClient.get({
      sql: `SELECT *
                  FROM users
                  WHERE email = ?1
                     OR browserFingerprint = ?2;`,
      params: {
        1: user.hashedEmail,
        2: user.browserFingerprint,
      },
    });

    return !!row;
  }
}
