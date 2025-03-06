import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { SQLiteClient } from '@/config/sqlite-client';
import { USER_REPOSITORY } from '@/user/domain';
import { SqliteUserRepository } from '@/user/sqlite.user.repository';
import { UserController } from '@/user/user.controller';
import { EncryptionService } from './encryption/encryption.service';

@Module({
  providers: [
    EncryptionService,
    UserService,
    SQLiteClient,
    {
      provide: USER_REPOSITORY,
      useClass: SqliteUserRepository,
    },
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
