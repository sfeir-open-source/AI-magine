import {
  ImageGenerationStatus,
  ImageGenerationStatusRepository,
} from 'src/image-generation/domain';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';

@Injectable()
export class SqliteImageGenerationStatusRepository
  implements ImageGenerationStatusRepository, OnApplicationBootstrap
{
  constructor(@Inject() private readonly sqliteClient: SQLiteClient) {}

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
}
