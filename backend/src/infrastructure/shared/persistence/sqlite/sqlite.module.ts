import { Module } from '@nestjs/common';
import { SQLiteEventsRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-events.repository';
import { SqliteImagesRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-images.repository';
import { SqlitePromptRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-prompt.repository';
import { SqliteUserRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-user.repository';
import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { SqliteImageGenerationStatusRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite.image-generation-status.repository';

@Module({
  providers: [
    SQLiteClient,
    SQLiteEventsRepository,
    SqlitePromptRepository,
    SqliteUserRepository,
    SqliteImageGenerationStatusRepository,
    SqliteImagesRepository,
  ],
  exports: [
    SQLiteEventsRepository,
    SqlitePromptRepository,
    SqliteUserRepository,
    SqliteImageGenerationStatusRepository,
    SqliteImagesRepository,
  ],
})
export class SqliteModule {}
