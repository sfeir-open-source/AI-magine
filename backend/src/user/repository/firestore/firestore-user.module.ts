import { Module } from '@nestjs/common';
import { FirestoreUserRepository } from '@/user/repository/firestore/firestore-user.repository';
import { FirestoreClient } from '@/config/firestore-client';

@Module({
  providers: [FirestoreClient, FirestoreUserRepository],
  exports: [FirestoreUserRepository],
})
export class FirestoreUserModule {}
