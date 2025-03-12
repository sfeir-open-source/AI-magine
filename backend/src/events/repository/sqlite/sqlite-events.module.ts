import { Module } from '@nestjs/common';
import { SQLiteClient } from '@/config/sqlite-client';
import { SQLiteEventsRepository } from '@/events/repository/sqlite/sqlite-events.repository';

@Module({
  providers: [SQLiteClient, SQLiteEventsRepository],
  exports: [SQLiteEventsRepository],
})
export class SQLiteEventsModule {}
