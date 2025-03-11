import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { UserModule } from '@/user/user.module';
import { SQLiteClient } from '@/config/sqlite-client';
import { PROMPT_REPOSITORY } from '@/prompt/domain';
import { SqlitePromptRepository } from '@/prompt/repository/sqlite/sqlite-prompt.repository';
import { ImageGenerationModule } from '@/image-generation/image-generation.module';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { IMAGE_GENERATION_STATUS_REPOSITORY } from '@/image-generation/domain';
import { SqliteImageGenerationStatusRepository } from '@/image-generation/sqlite.image-generation-status.repository';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SqliteImagesRepository } from '@/images/repository/sqlite/sqlite-images.repository';
import { ImagesModule } from '@/images/images.module';
import { SfeirEventModule } from '@/events/sfeir-event.module';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { SFEIR_EVENT_REPOSITORY } from '@/events/domain';
import { SqliteSfeirEventRepository } from '@/events/sqlite.sfeir-event.repository';
import { FirestoreImageGenerationStatusRepository } from '@/image-generation/firestore.image-generation-status.repository';
import { FirestorePromptRepository } from '@/prompt/repository/firestore/firestore-prompt.repository';
import { FirestoreImagesRepository } from '@/images/repository/firestore/firestore-images.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { IMAGES_STORAGE } from '@/images/domain/images.storage';
import { GCPBucketImagesStorage } from '@/images/gcp-bucket.images.storage';
import { FakeImagesStorage } from '@/images/fake.images.storage';
import { ConfigurationService } from '@/configuration/configuration.service';
import { FirestoreSfeirEventRepository } from '@/events/firestore.sfeir-event.repository';
import { SqlitePromptModule } from '@/prompt/repository/sqlite/sqlite-prompt.module';
import { FirestorePromptModule } from '@/prompt/repository/firestore/firestore-prompt.module';
import { FirestoreImagesModule } from '@/images/repository/firestore/firestore-images.module';
import { SqliteImagesModule } from '@/images/repository/sqlite/sqlite-images.module';

@Module({
  imports: [
    UserModule,
    ImageGenerationModule,
    ImagesModule,
    FirestoreImagesModule,
    SqliteImagesModule,
    SfeirEventModule,
    SqlitePromptModule,
    FirestorePromptModule,
  ],
  controllers: [PromptController],
  providers: [
    SfeirEventService,
    PromptService,
    ImageGenerationEngine,
    {
      provide: IMAGES_STORAGE,
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) =>
        configurationService.getBucketEnabled()
          ? new GCPBucketImagesStorage(configurationService)
          : new FakeImagesStorage(),
    },
    {
      provide: PROMPT_REPOSITORY,
      inject: [
        ConfigurationService,
        FirestorePromptRepository,
        SqlitePromptRepository,
      ],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreRepo: FirestorePromptRepository,
        sqliteRepo: SqlitePromptRepository
      ) =>
        configurationService.getFirestoreEnabled() ? firestoreRepo : sqliteRepo,
    },
    {
      provide: IMAGE_GENERATION_STATUS_REPOSITORY,
      inject: [ConfigurationService, FirestoreClient, SQLiteClient],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreClient: FirestoreClient,
        sqliteClient: SQLiteClient
      ) =>
        configurationService.getFirestoreEnabled()
          ? new FirestoreImageGenerationStatusRepository(firestoreClient)
          : new SqliteImageGenerationStatusRepository(sqliteClient),
    },
    {
      provide: IMAGES_REPOSITORY,
      inject: [
        ConfigurationService,
        FirestoreImagesRepository,
        SqliteImagesRepository,
      ],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreRepo: FirestoreImagesRepository,
        sqliteRepo: SqliteImagesRepository
      ) =>
        configurationService.getFirestoreEnabled() ? firestoreRepo : sqliteRepo,
    },
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
})
export class PromptModule {}
