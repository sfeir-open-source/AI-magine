import { ImageRepository } from '@/core/domain/image/image.repository';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { Image } from '@/core/domain/image/image';
import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';

@Injectable()
export class SqliteImagesRepository
  implements ImageRepository, OnApplicationBootstrap
{
  constructor(private readonly sqliteClient: SQLiteClient) {}

  async onApplicationBootstrap() {
    await this.sqliteClient.run({
      sql: `CREATE TABLE IF NOT EXISTS images
            (
                id        TEXT PRIMARY KEY,
                url       TEXT      NOT NULL,
                promptId  TEXT      NOT NULL,
                selected  BOOLEAN   NOT NULL DEFAULT FALSE,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
      `,
    });
  }

  async getImageByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<ImageWithPromptTextDto[]> {
    const rows = await this.sqliteClient.all<{
      id: string;
      url: string;
      selected: boolean;
      promptId: string;
      prompt: string;
      createdAt: Date;
    }>({
      sql: `SELECT images.id        as id,
                   images.url       as url,
                   images.selected  as selected,
                   prompts.id       as promptId,
                   prompts.prompt   as prompt,
                   images.createdAt as createdAt
            FROM images
                     INNER JOIN main.prompts prompts on images.promptId = prompts.id
            WHERE event_id = $1
              AND user_id = $2;`,
      params: {
        1: eventId,
        2: userId,
      },
    });

    return rows.map(
      (row) =>
        new ImageWithPromptTextDto({
          id: row.id,
          url: row.url,
          createdAt: row.createdAt,
          selected: row.selected,
          promptId: row.promptId,
          prompt: row.prompt,
        })
    );
  }

  async getEventPromotedImages(
    eventId: string
  ): Promise<ImageWithPromptTextAndAuthorDto[]> {
    const rows = await this.sqliteClient.all<{
      id: string;
      url: string;
      selected: boolean;
      promptId: string;
      prompt: string;
      createdAt: Date;
      userNickname: string;
    }>({
      sql: `SELECT images.id        as id,
                   images.url       as url,
                   images.selected  as selected,
                   images.createdAt as createdAt,
                   prompts.id       as promptId,
                   prompts.prompt   as prompt,
                   users.nickname   as userNickname
            FROM images
                     INNER JOIN main.prompts prompts
                                on images.promptId = prompts.id
                     INNER JOIN main.users users on prompts.userId = users.id
            WHERE event_id = $1
              AND selected = true;`,
      params: {
        1: eventId,
      },
    });

    return rows.map(
      (row) =>
        new ImageWithPromptTextAndAuthorDto({
          id: row.id,
          url: row.url,
          createdAt: row.createdAt,
          selected: row.selected,
          promptId: row.promptId,
          prompt: row.prompt,
          author: row.userNickname,
        })
    );
  }

  async saveImage(image: Image): Promise<Image> {
    await this.sqliteClient.run({
      sql: `INSERT INTO images (id, url, promptId, selected, createdAt)
            VALUES (?1, ?2, ?3, ?4, ?5);`,
      params: {
        1: image.id,
        2: image.url,
        4: image.selected,
        3: image.promptId,
        5: image.createdAt,
      },
    });
    return image;
  }

  async getImageByPromptId(promptId: string): Promise<Image | undefined> {
    const row = await this.sqliteClient.get<{
      id: string;
      url: string;
      promptId: string;
      selected: boolean;
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
    return Image.from(
      row.id,
      row.url,
      row.promptId,
      row.createdAt,
      row.selected
    );
  }
}
