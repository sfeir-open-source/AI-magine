import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { SQLiteClient } from '@/config/sqlite-client';
import { USER_REPOSITORY } from '@/user/domain';
import { SqliteUserRepository } from '@/user/sqlite.user.repository';
import { FirestoreUserRepository } from '@/user/firestore.user.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UserController } from '@/user/user.controller';
import { EncryptionService } from './encryption/encryption.service';
import { FirestoreUserModule } from '@/user/repository/firestore/firestore-user.module';
import { SqliteUserModule } from '@/user/repository/sqlite/sqlite-user.module';

@Module({
  imports: [FirestoreUserModule, SqliteUserModule],
  imports: [SfeirEventModule, ImagesModule],
  providers: [
    EncryptionService,
    UserService,
    SQLiteClient,
    FirestoreClient,
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
      inject: [ConfigurationService, FirestoreClient, SQLiteClient],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreClient: FirestoreClient,
        sqliteClient: SQLiteClient
      ) =>
        configurationService.getFirestoreEnabled()
          ? new FirestoreImagesRepository(firestoreClient)
          : new SqliteImagesRepository(sqliteClient),
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
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
