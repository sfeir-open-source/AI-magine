import { Module } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqlitePromptRepository } from '@/prompt/repository/sqlite/sqlite-prompt.repository';

@Module({
  providers: [SQLiteClient, SqlitePromptRepository],
  exports: [SqlitePromptRepository],
})
export class SqlitePromptModule {}
