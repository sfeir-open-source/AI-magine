import { Module } from '@nestjs/common';
import { EncryptionService } from '@/infrastructure/shared/encryption/encryption.service';

@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
