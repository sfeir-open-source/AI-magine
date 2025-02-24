import { verbose, Database } from 'sqlite3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SQLiteClient {
  private client: Database;
  private isReady = false;

  constructor() {
    const SQLITE3 = verbose();
    this.client = new SQLITE3.Database(
      process.env.SQLITE_DB_PATH ?? ':memory:'
    );
  }

  async serialize() {
    if (this.isReady) {
      return;
    }
    return new Promise((resolve) =>
      this.client.serialize(() => {
        this.isReady = true;
        resolve(null);
      })
    );
  }

  async close() {
    return new Promise((resolve) => this.client.close(resolve));
  }

  async run({
    sql,
    params,
  }: {
    sql: string;
    params?: Record<string, unknown>;
  }) {
    await this.serialize();
    return new Promise((resolve, reject) =>
      this.client.run(sql, params, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(null);
      })
    );
  }

  async get<T>({
    sql,
    params,
  }: {
    sql: string;
    params?: Record<string, unknown>;
  }): Promise<T> {
    await this.serialize();
    return new Promise((resolve, reject) => {
      this.client.get(sql, params, (err, row) => {
        if (err) return reject(err);
        return resolve(row as T);
      });
    });
  }

  async all<T>({
    sql,
    params,
  }: {
    sql: string;
    params?: Record<string, unknown>;
  }): Promise<T[]> {
    await this.serialize();
    return new Promise((resolve, reject) => {
      this.client.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        return resolve(rows.map((row) => row as T));
      });
    });
  }
}
