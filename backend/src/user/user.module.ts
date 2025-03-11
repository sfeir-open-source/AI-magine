import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { USER_REPOSITORY } from '@/user/domain';
import { SqliteUserRepository } from '@/user/repository/sqlite/sqlite-user.repository';
import { FirestoreUserRepository } from '@/user/repository/firestore/firestore-user.repository';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UserController } from '@/user/user.controller';
import { EncryptionService } from './encryption/encryption.service';
import { FirestoreUserModule } from '@/user/repository/firestore/firestore-user.module';
import { SqliteUserModule } from '@/user/repository/sqlite/sqlite-user.module';

@Module({
  imports: [FirestoreUserModule, SqliteUserModule],
  providers: [
    EncryptionService,
    UserService,
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
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
