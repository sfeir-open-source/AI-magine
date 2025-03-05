import { Module } from '@nestjs/common';
import { SfeirEventController } from '@/events/sfeir-event.controller';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { SFEIR_EVENT_REPOSITORY } from '@/events/domain';
import { SQLiteClient } from '@/config/sqlite-client';
import { FirestoreSfeirEventRepository } from '@/events/firestore.sfeir-event.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from '@/configuration/configuration.service';
import { SqliteSfeirEventRepository } from '@/events/sqlite.sfeir-event.repository';

@Module({
  controllers: [SfeirEventController],
  imports: [ConfigModule],
  providers: [
    SfeirEventService,
    SQLiteClient,
    FirestoreClient,
    {
      provide: SFEIR_EVENT_REPOSITORY,
      inject: [ConfigurationService, FirestoreClient, SQLiteClient],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreClient: FirestoreClient,
        sqliteClient: SQLiteClient
      ) => {
        return configurationService.getFirestoreEnabled()
          ? new FirestoreSfeirEventRepository(firestoreClient)
          : new SqliteSfeirEventRepository(sqliteClient);
      },
    },
  ],
  exports: [SfeirEventService],
})
export class SfeirEventModule {}
