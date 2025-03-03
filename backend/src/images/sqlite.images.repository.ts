import { ImagesRepository } from '@/images/images-types/images.repository';
import { Image } from './images-types';
import { Inject } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';

export class SqliteImagesRepository implements ImagesRepository {
  private tableInitialized = false;

  constructor(
    @Inject()
    private readonly sqliteClient: SQLiteClient
  ) {}

  private async initTable() {
    if (this.tableInitialized) return;
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS images
                      (
                          id        TEXT PRIMARY KEY,
                          url       TEXT      NOT NULL,
                          promptId  TEXT      NOT NULL,
                          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                      );`,
    });
    this.tableInitialized = true;
  }

  async saveImage(image: Image): Promise<Image> {
    await this.initTable();
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
    await this.initTable();
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
