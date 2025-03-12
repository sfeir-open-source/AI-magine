import { Module } from '@nestjs/common';
import { SqliteUserRepository } from '@/user/repository/sqlite/sqlite-user.repository';
import { SQLiteClient } from '@/config/sqlite-client';

@Module({
  providers: [SQLiteClient, SqliteUserRepository],
  exports: [SqliteUserRepository],
})
export class SqliteUserModule {}
