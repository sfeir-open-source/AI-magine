import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { User } from '@/core/domain/user/user';
import { UserRepository } from '@/core/domain/user/user.repository';

@Injectable()
export class SqliteUserRepository
  implements UserRepository, OnApplicationBootstrap
{
  constructor(private readonly sqliteClient: SQLiteClient) {}

  async onApplicationBootstrap() {
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS users
            (
                id                 TEXT PRIMARY KEY,
                nickname           TEXT    NOT NULL,
                hashedEmail        TEXT    NOT NULL,
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
      hashedEmail: string;
      nickname: string;
      browserFingerprint: string;
      allowContact: boolean;
    }>({
      sql: `SELECT id, hashedEmail, nickname, browserFingerprint, allowContact
            FROM users
            WHERE email = ?1;`,
      params: {
        1: email,
      },
    });

    if (!storedUser) return undefined;

    return User.from({
      id: storedUser.id,
      email: storedUser.hashedEmail,
      nickname: storedUser.nickname,
      browserFingerprint: storedUser.browserFingerprint,
      allowContact: storedUser.allowContact,
    });
  }

  async save(user: User): Promise<User> {
    await this.sqliteClient.run({
      sql: `INSERT INTO users (id, nickname, hashedEmail, browserFingerprint, allowContact)
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

  async countUsersByEvent(eventId: string): Promise<number> {
    const { count } = await this.sqliteClient.get<{ count: number }>({
      sql: `SELECT COUNT(DISTINCT u.id) AS user_count
            FROM users u
                     INNER JOIN prompts p ON u.id = p.user_id
            WHERE p.event_id = ?1;`,
      params: {
        1: eventId,
      },
    });
    return count ?? 0;
  }

  async getUserByUserName(username: string): Promise<User | undefined> {
    const storedUser = await this.sqliteClient.get<{
      id: string;
      nickname: string;
      hashedEmail: string;
      browserFingerprint: string;
      allowContact: boolean;
    }>({
      sql: `SELECT id, nickname, hashedEmail, browserFingerprint, allowContact
            FROM users
            WHERE nickname = ?1;
      `,
      params: {
        1: username,
      },
    });
    if (!storedUser) return undefined;
    return User.from({
      id: storedUser.id,
      email: storedUser.hashedEmail,
      nickname: storedUser.nickname,
      browserFingerprint: storedUser.browserFingerprint,
      allowContact: storedUser.allowContact,
    });
  }

  async getUsersByEvent(eventId: string): Promise<User[]> {
    const rows = await this.sqliteClient.all<{
      id: string;
      nickname: string;
      hashedEmail: string;
      browserFingerprint: string;
      allowContact: boolean;
    }>({
      sql: `SELECT id, nickname, hashedEmail, browserFingerprint, allowContact
            FROM users u
                     INNER JOIN prompts p ON u.id = p.user_id
            WHERE p.event_id = ?1;`,
      params: {
        1: eventId,
      },
    });
    return rows.map((row) =>
      User.from({
        id: row.id,
        email: row.hashedEmail,
        nickname: row.nickname,
        browserFingerprint: row.browserFingerprint,
        allowContact: row.allowContact,
      })
    );
  }
}
