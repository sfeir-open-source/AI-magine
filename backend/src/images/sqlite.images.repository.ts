import { ImagesRepository } from '@/images/images-types/images.repository';
import { Image } from './images-types';
import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';

export class SqliteImagesRepository
  implements ImagesRepository, OnApplicationBootstrap
{
  constructor(
    @Inject()
    private readonly sqliteClient: SQLiteClient
  ) {}

  async onApplicationBootstrap() {
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS images
                  (
                      id        TEXT PRIMARY KEY,
                      url       TEXT      NOT NULL,
                      promptId  TEXT      NOT NULL,
                      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  );`,
    });
  }

  async saveImage(image: Image): Promise<Image> {
    await this.sqliteClient.run({
      sql: `INSERT INTO images (id, url, promptId, createdAt)
                  VALUES (?1, ?2, ?3, ?4);`,
      params: {
        1: image.id,
        2: image.url,
        3: image.promptId,
        4: image.createdAt,
      },
    });
    return image;
  }

  async getImageByPromptId(promptId: string): Promise<Image | undefined> {
    const row = await this.sqliteClient.get<{
      id: string;
      url: string;
      promptId: string;
      createdAt: Date;
    }>({
      sql: `SELECT *
                  FROM images
                  WHERE promptId = ?1`,
      params: {
        1: promptId,
      },
    });
    if (!row) {
      return undefined;
    }
    return Image.from(row.id, row.url, row.promptId, row.createdAt);
  }
}
