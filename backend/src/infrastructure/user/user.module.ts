import { Module } from '@nestjs/common';
import { UserController } from '@/infrastructure/user/user.controller';
import { UserServiceImpl } from '@/infrastructure/user/user.service.impl';
import { USER_SERVICE } from '@/core/application/user/user.service';
import { PersistenceModule } from '@/infrastructure/shared/persistence/persistence.module';
import { EncryptionModule } from '@/infrastructure/shared/encryption/encryption.module';

@Module({
  imports: [PersistenceModule, EncryptionModule],
  controllers: [UserController],
  providers: [{ provide: USER_SERVICE, useClass: UserServiceImpl }],
  exports: [USER_SERVICE],
})
export class UserModule {}
