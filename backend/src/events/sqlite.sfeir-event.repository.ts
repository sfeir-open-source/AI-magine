import { SfeirEventBuilder, SfeirEventRepository } from '@/events/events-types';
import { SQLiteClient } from '@/config/sqlite-client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SqliteSfeirEventRepository implements SfeirEventRepository {
  constructor(@Inject() private sqliteClient: SQLiteClient) {
    this.sqliteClient
      .run({
        sql: `CREATE TABLE IF NOT EXISTS events
                      (
                          id          TEXT PRIMARY KEY,
                          name        TEXT,
                          startDateTs INTEGER,
                          endDateTs   INTEGER
                      );`,
      })
      .catch(console.error);
  }

  async getSfeirEvents(): Promise<ReturnType<SfeirEventBuilder['build']>[]> {
    const storedEvents = await this.sqliteClient.all<{
      id: string;
      name: string;
      startDateTs: number;
      endDateTs: number;
    }>({
      sql: `SELECT id, name, startDateTs, endDateTs
                  FROM events`,
      params: {},
    });
    return storedEvents.map((storedEvent) =>
      SfeirEventBuilder.create()
        .withId(storedEvent.id)
        .withName(storedEvent.name)
        .withStartDate(new Date(storedEvent.startDateTs))
        .withEndDate(new Date(storedEvent.endDateTs))
        .build()
    );
  }

  async saveSfeirEvent(
    sfeirEvent: ReturnType<SfeirEventBuilder['build']>
  ): Promise<ReturnType<SfeirEventBuilder['build']>> {
    const newSfeirEvent = sfeirEvent.toJSON();
    await this.sqliteClient.run({
      sql: `INSERT INTO events (id, name, startDateTs, endDateTs)
                  VALUES (?1, ?2, ?3, ?4);`,
      params: {
        1: newSfeirEvent.id,
        2: newSfeirEvent.name,
        3: newSfeirEvent.startDate.getTime(),
        4: newSfeirEvent.endDate.getTime(),
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

  async getSfeirEvent(
    id: string
  ): Promise<ReturnType<SfeirEventBuilder['build']> | undefined> {
    const row = await this.sqliteClient.get<{
      id: string;
      name: string;
      startDateTs: number;
      endDateTs: number;
    }>({
      sql: `SELECT id, name, startDateTs, endDateTs
                  FROM events
                  WHERE id = ?1;`,
      params: { 1: id },
    });
    if (!row) {
      return undefined;
    }
    return SfeirEventBuilder.create()
      .withId(row.id)
      .withName(row.name)
      .withStartDate(new Date(row.startDateTs))
      .withEndDate(new Date(row.endDateTs))
      .build();
  }
}
