import { Module } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteImagesRepository } from '@/images/repository/sqlite/sqlite-images.repository';

@Module({
  providers: [SQLiteClient, SqliteImagesRepository],
  exports: [SqliteImagesRepository],
})
export class SqliteImagesModule {}
