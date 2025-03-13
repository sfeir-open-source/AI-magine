import { Module } from '@nestjs/common';
import { SfeirEventController } from '@/events/sfeir-event.controller';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { SFEIR_EVENT_REPOSITORY } from '@/events/domain';
import { SQLiteClient } from '@/config/sqlite-client';
import { FirestoreEventsRepository } from '@/events/repository/firestore/firestore-events.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { ConfigurationService } from '@/configuration/configuration.service';
import { SQLiteEventsRepository } from '@/events/repository/sqlite/sqlite-events.repository';
import { FirestoreEventsModule } from '@/events/repository/firestore/firestore-events.module';
import { SQLiteEventsModule } from '@/events/repository/sqlite/sqlite-events.module';

@Module({
  imports: [FirestoreEventsModule, SQLiteEventsModule],
  controllers: [SfeirEventController],
  providers: [
    SfeirEventService,
    SQLiteClient,
    FirestoreClient,
    {
      provide: SFEIR_EVENT_REPOSITORY,
      inject: [
        ConfigurationService,
        FirestoreEventsRepository,
        SQLiteEventsRepository,
      ],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreRepo: FirestoreEventsRepository,
        sqliteRepo: SQLiteEventsRepository
      ) => {
        return configurationService.getFirestoreEnabled()
          ? firestoreRepo
          : sqliteRepo;
      },
    },
  ],
  exports: [SfeirEventService],
})
export class SfeirEventModule {}
