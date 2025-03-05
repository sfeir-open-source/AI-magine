import { Module } from '@nestjs/common';
import { SfeirEventController } from '@/events/sfeir-event.controller';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { SFEIR_EVENT_REPOSITORY } from 'src/events/domain';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteSfeirEventRepository } from '@/events/sqlite.sfeir-event.repository';

@Module({
  controllers: [SfeirEventController],
  providers: [
    SfeirEventService,
    SQLiteClient,
    {
      provide: SFEIR_EVENT_REPOSITORY,
      useClass: SqliteSfeirEventRepository,
    },
  ],
})
export class SfeirEventModule {}
