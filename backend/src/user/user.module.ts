import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { SQLiteClient } from '@/config/sqlite-client';
import { USER_REPOSITORY } from 'src/user/domain';
import { SqliteUserRepository } from '@/user/sqlite.user.repository';

@Module({
  providers: [
    UserService,
    SQLiteClient,
    {
      provide: USER_REPOSITORY,
      useClass: SqliteUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
