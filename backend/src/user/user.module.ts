import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { SQLiteClient } from '@/config/sqlite-client';
import { USER_REPOSITORY } from '@/user/domain';
import { SqliteUserRepository } from '@/user/sqlite.user.repository';
import { FirestoreUserRepository } from '@/user/firestore.user.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UserController } from '@/user/user.controller';
import { EncryptionService } from './encryption/encryption.service';
import { FirestoreUserRepository } from '@/user/firestore.user.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UserController } from '@/user/user.controller';
import { EncryptionService } from './encryption/encryption.service';

@Module({
  imports: [ConfigModule],
  providers: [
    EncryptionService,
    UserService,
    SQLiteClient,
    FirestoreClient,
    {
      provide: USER_REPOSITORY,
      inject: [ConfigurationService, FirestoreClient, SQLiteClient],
      useFactory: (
        configurationService: ConfigurationService,
        firestoreClient: FirestoreClient,
        sqliteClient: SQLiteClient
      ) =>
        configurationService.getFirestoreEnabled()
          ? new FirestoreUserRepository(firestoreClient)
          : new SqliteUserRepository(sqliteClient),
    },
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
