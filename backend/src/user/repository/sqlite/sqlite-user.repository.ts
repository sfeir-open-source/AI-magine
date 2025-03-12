import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { User, UserRepository } from '@/user/domain';

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
                      nickname           TEXT    NOT NULL,
                      email              TEXT    NOT NULL,
                      browserFingerprint TEXT    NOT NULL,
                      allowContact       BOOLEAN NOT NULL DEFAULT 1
                  );`,
    });
  }

  async getUserIdByEmail(email: string): Promise<string | undefined> {
    const storedUser = await this.getUserByEmail(email);

    return storedUser?.id;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const storedUser = await this.sqliteClient.get<{
      id: string;
      email: string;
      nickname: string;
      browserFingerprint: string;
      allowContact: boolean;
    }>({
      sql: `SELECT id, email, nickname, browserFingerprint, allowContact
            FROM users
            WHERE email = ?1;`,
      params: {
        1: email,
      },
    });

    if (!storedUser) return undefined;

    return User.from({
      id: storedUser.id,
      email: storedUser.email,
      nickname: storedUser.nickname,
      browserFingerprint: storedUser.browserFingerprint,
      allowContact: storedUser.allowContact,
    });
  }

  async save(user: User): Promise<User> {
    await this.sqliteClient.run({
      sql: `INSERT INTO users (id, nickname, email, browserFingerprint, allowContact)
            VALUES (?1, ?2, ?3, ?4, ?5);`,
      params: {
        1: user.id,
        2: user.nickname,
        3: user.email,
        4: user.browserFingerprint,
        5: user.allowContact,
      },
    });

    return user;
  }

  async checkExistsById(userId: string): Promise<boolean> {
    const row = await this.sqliteClient.get({
      sql: `SELECT *
            FROM users
            WHERE id = ?1`,
      params: {
        1: userId,
      },
    });

    return !!row;
  }
}
