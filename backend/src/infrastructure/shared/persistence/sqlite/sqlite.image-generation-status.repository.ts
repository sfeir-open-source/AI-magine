import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { ImageGenerationStatusRepository } from '@/core/domain/image-generation/image-generation-status.repository';
import { ImageGenerationStatus } from '@/core/domain/image-generation/image-generation-status';

@Injectable()
export class SqliteImageGenerationStatusRepository
  implements ImageGenerationStatusRepository, OnApplicationBootstrap
{
  constructor(private readonly sqliteClient: SQLiteClient) {}

  async onApplicationBootstrap() {
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS image_generation_status
                  (
                      id        TEXT PRIMARY KEY,
                      promptId  TEXT      NOT NULL,
                      status    TEXT      NOT NULL,
                      payload   TEXT,
                      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  );`,
    });
  }

  async getPromptGenerationStatus(
    promptId: string
  ): Promise<ImageGenerationStatus | undefined> {
    const row = await this.sqliteClient.get<{
      id: string;
      promptId: string;
      status: string;
      payload?: string;
      updatedAt: Date;
    }>({
      sql: `SELECT *
                  FROM image_generation_status
                  WHERE promptId = ?1
                  ORDER BY updatedAt DESC
                  LIMIT 1
            ;`,
      params: {
        1: promptId,
      },
    });
    if (!row) return undefined;
    return ImageGenerationStatus.from(
      row.id,
      row.promptId,
      row.status,
      row.payload ?? '',
      row.updatedAt
    );
  }

  async updatePromptGenerationStatus(
    promptId: string,
    status: string,
    payload = ''
  ): Promise<ImageGenerationStatus> {
    const newImageGenerationStatus = ImageGenerationStatus.create(
      promptId,
      status,
      payload
    );
    await this.sqliteClient.run({
      sql: `INSERT INTO image_generation_status (id, promptId, status, payload, updatedAt)
                  VALUES (?1, ?2, ?3, ?4, ?5);`,
      params: {
        1: newImageGenerationStatus.id,
        2: newImageGenerationStatus.promptId,
        3: newImageGenerationStatus.status,
        4: newImageGenerationStatus.payload,
        5: newImageGenerationStatus.updatedAt,
      },
    });
    return newImageGenerationStatus;
  }

  async countStatusByEvent(eventId: string, status: string): Promise<number> {
    const { count } = await this.sqliteClient.get<{ count: number }>({
      sql: `SELECT COUNT(*) AS count
            FROM image_generation_status
            WHERE promptId IN (SELECT promptId FROM prompts WHERE event_id = ?1)
            AND status = ?2;`,
      params: {
        1: eventId,
        2: status,
      },
    });
    return count ?? 0;
  }
}
