import { SfeirEvent, SfeirEventRepository } from '@/events/events-types';
import { SQLiteClient } from '@/config/sqlite-client';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';

type SfeirEventRow = {
  id: string;
  name: string;
  startDateTs: number;
  endDateTs: number;
};

@Injectable()
export class SqliteSfeirEventRepository
  implements SfeirEventRepository, OnApplicationBootstrap
{
  constructor(@Inject() private sqliteClient: SQLiteClient) {}

  async onApplicationBootstrap() {
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS events
                  (
                      id          TEXT PRIMARY KEY,
                      name        TEXT    NOT NULL,
                      startDateTs INTEGER NOT NULL,
                      endDateTs   INTEGER NOT NULL
                  );`,
    });
  }

  async getSfeirEvents(): Promise<SfeirEvent[]> {
    const storedEvents = await this.sqliteClient.all<SfeirEventRow>({
      sql: `SELECT id, name, startDateTs, endDateTs
                  FROM events`,
      params: {},
    });
    return storedEvents.map((storedEvent) =>
      SfeirEvent.from(
        storedEvent.id,
        storedEvent.name,
        new Date(storedEvent.startDateTs),
        new Date(storedEvent.endDateTs)
      )
    );
  }

  async saveSfeirEvent(sfeirEvent: SfeirEvent): Promise<SfeirEvent> {
    await this.sqliteClient.run({
      sql: `INSERT INTO events (id, name, startDateTs, endDateTs)
                  VALUES (?1, ?2, ?3, ?4);`,
      params: {
        1: sfeirEvent.id,
        2: sfeirEvent.name,
        3: sfeirEvent.startDate.getTime(),
        4: sfeirEvent.endDate.getTime(),
      },
    });
    return sfeirEvent;
  }

  async deleteSfeirEvent(id: string): Promise<void> {
    await this.sqliteClient.run({
      sql: `DELETE
                  FROM events
                  WHERE id = ?1;`,
      params: { 1: id },
    });
  }

  async getSfeirEvent(id: string): Promise<SfeirEvent | undefined> {
    const row = await this.sqliteClient.get<SfeirEventRow>({
      sql: `SELECT id, name, startDateTs, endDateTs
                  FROM events
                  WHERE id = ?1;`,
      params: { 1: id },
    });
    if (!row) {
      return undefined;
    }
    return SfeirEvent.from(
      row.id,
      row.name,
      new Date(row.startDateTs),
      new Date(row.endDateTs)
    );
  }
}
