import { Module } from '@nestjs/common';
import { FirestorePromptRepository } from '@/prompt/repository/firestore/firestore-prompt.repository';
import { FirestoreClient } from '@/config/firestore-client';

@Module({
  providers: [FirestoreClient, FirestorePromptRepository],
  exports: [FirestorePromptRepository],
})
export class FirestorePromptModule {}
