import { Inject, Injectable } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { PromptRepository } from '@/prompt/prompt-types';
import { Prompt } from '@/prompt/prompt-types/prompt.domain';

@Injectable()
export class SqlitePromptRepository implements PromptRepository {
  constructor(@Inject() private readonly sqliteClient: SQLiteClient) {
    this.sqliteClient
      .run({
        sql: `CREATE TABLE IF NOT EXISTS prompts
                      (
                          id       TEXT PRIMARY KEY,
                          user_id  TEXT,
                          event_id TEXT,
                          prompt   TEXT
                      );`,
      })
      .catch(console.error);
  }

  async countByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<number> {
    const { count } = await this.sqliteClient.get<{ count: number }>({
      sql: `SELECT COUNT(*) AS count
                  FROM prompts
                  WHERE event_id = ?1
                    AND user_id = ?2;`,
      params: {
        1: eventId,
        2: userId,
      },
    });
    return count ?? 0;
  }

  async save(prompt: Prompt): Promise<Prompt> {
    await this.sqliteClient.run({
      sql: `INSERT INTO prompts (id, user_id, event_id, prompt)
                  VALUES (?1, ?2, ?3, ?4);`,
      params: {
        1: prompt.id,
        2: prompt.userId,
        3: prompt.eventId,
        4: prompt.prompt,
      },
    });
    return prompt;
  }
}
