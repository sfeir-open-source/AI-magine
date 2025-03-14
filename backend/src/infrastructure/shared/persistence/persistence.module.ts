import { Module } from '@nestjs/common';
import { FirestoreModule } from '@/infrastructure/shared/persistence/firestore/firestore.module';
import { SqliteModule } from '@/infrastructure/shared/persistence/sqlite/sqlite.module';
import { SFEIR_EVENT_REPOSITORY } from '@/core/domain/sfeir-event/sfeir-event.repository';
import { ConfigurationModule } from '@/infrastructure/shared/configuration/configuration.module';
import { ConfigurationService } from '@/infrastructure/shared/configuration/configuration.service';
import { FirestoreEventsRepository } from '@/infrastructure/shared/persistence/firestore/firestore-events.repository';
import { SQLiteEventsRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-events.repository';
import { IMAGES_REPOSITORY } from '@/core/domain/image/image.repository';
import { FirestoreImagesRepository } from '@/infrastructure/shared/persistence/firestore/firestore-images.repository';
import { SqliteImagesRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-images.repository';
import { PROMPT_REPOSITORY } from '@/core/domain/prompt/prompt.repository';
import { FirestorePromptRepository } from '@/infrastructure/shared/persistence/firestore/firestore-prompt.repository';
import { SqlitePromptRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-prompt.repository';
import { USER_REPOSITORY } from '@/core/domain/user/user.repository';
import { FirestoreUserRepository } from '@/infrastructure/shared/persistence/firestore/firestore-user.repository';
import { SqliteUserRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-user.repository';
import { IMAGE_GENERATION_STATUS_REPOSITORY } from '@/core/domain/image-generation/image-generation-status.repository';
import { FirestoreImageGenerationStatusRepository } from '@/infrastructure/shared/persistence/firestore/firestore.image-generation-status.repository';
import { SqliteImageGenerationStatusRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite.image-generation-status.repository';

const getPersistenceProviderConfig = <FirestoreRepo, SqliteRepo>(
  providerSymbol: symbol,
  firestoreRepo: FirestoreRepo,
  sqliteRepo: SqliteRepo
) => {
  return {
    provide: providerSymbol,
    inject: [ConfigurationService, firestoreRepo, sqliteRepo],
    useFactory: (
      config: ConfigurationService,
      firestoreRepo: FirestoreRepo,
      sqliteRepo: SqliteRepo
    ) => {
      return config.getFirestoreEnabled() ? firestoreRepo : sqliteRepo;
    },
  };
};

@Module({
  imports: [FirestoreModule, SqliteModule, ConfigurationModule],
  providers: [
    getPersistenceProviderConfig(
      SFEIR_EVENT_REPOSITORY,
      FirestoreEventsRepository,
      SQLiteEventsRepository
    ),
    getPersistenceProviderConfig(
      IMAGES_REPOSITORY,
      FirestoreImagesRepository,
      SqliteImagesRepository
    ),
    getPersistenceProviderConfig(
      PROMPT_REPOSITORY,
      FirestorePromptRepository,
      SqlitePromptRepository
    ),
    getPersistenceProviderConfig(
      USER_REPOSITORY,
      FirestoreUserRepository,
      SqliteUserRepository
    ),
    getPersistenceProviderConfig(
      IMAGE_GENERATION_STATUS_REPOSITORY,
      FirestoreImageGenerationStatusRepository,
      SqliteImageGenerationStatusRepository
    ),
  ],
  exports: [
    SFEIR_EVENT_REPOSITORY,
    IMAGES_REPOSITORY,
    PROMPT_REPOSITORY,
    USER_REPOSITORY,
    IMAGE_GENERATION_STATUS_REPOSITORY,
  ],
})
export class PersistenceModule {}
