import { Module } from '@nestjs/common';
import { FirestoreUserModule } from '@/user/repository/firestore/firestore-user.module';
import { SqliteUserModule } from '@/user/repository/sqlite/sqlite-user.module';
import { EncryptionService } from '@/user/encryption/encryption.service';
import { UserService } from '@/user/user.service';
import { SqliteUserRepository } from '@/user/repository/sqlite/sqlite-user.repository';
import { FirestoreUserRepository } from '@/user/repository/firestore/firestore-user.repository';
import { ConfigurationService } from '@/configuration/configuration.service';
import { SqliteImagesRepository } from '@/images/repository/sqlite/sqlite-images.repository';
import { FirestoreImagesRepository } from '@/images/repository/firestore/firestore-images.repository';
import { SQLiteEventsRepository } from '@/events/repository/sqlite/sqlite-events.repository';
import { USER_REPOSITORY } from '@/user/domain';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SFEIR_EVENT_REPOSITORY } from '@/events/domain';
import { FirestoreEventsRepository } from '@/events/repository/firestore/firestore-events.repository';
import { UserController } from '@/user/user.controller';
import { FirestoreClient } from '@/config/firestore-client';
import { SQLiteClient } from '@/config/sqlite-client';
import { FirestoreImagesModule } from '@/images/repository/firestore/firestore-images.module';
import { SqliteImagesModule } from '@/images/repository/sqlite/sqlite-images.module';
import { SQLiteEventsModule } from '@/events/repository/sqlite/sqlite-events.module';
import { FirestoreEventsModule } from '@/events/repository/firestore/firestore-events.module';
import { FirestorePromptRepository } from '@/prompt/repository/firestore/firestore-prompt.repository';

@Module({
  imports: [
    FirestoreUserModule,
    SqliteUserModule,
    FirestoreImagesModule,
    SqliteImagesModule,
    FirestoreEventsModule,
    SQLiteEventsModule,
  ],
  providers: [
    EncryptionService,
    UserService,
    SqliteUserRepository,
    FirestoreUserRepository,
    SQLiteEventsRepository,
    FirestorePromptRepository,
    SqliteImagesRepository,
    FirestoreImagesRepository,
    SQLiteEventsRepository,
    FirestoreEventsRepository,
    FirestoreClient,
    SQLiteClient,
    {
      provide: USER_REPOSITORY,
      inject: [
        ConfigurationService,
        FirestoreUserRepository,
        SqliteUserRepository,
      ],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreRepo: FirestoreUserRepository,
        sqliteRepo: SqliteUserRepository
      ) =>
        configurationService.getFirestoreEnabled() ? firestoreRepo : sqliteRepo,
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
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
