import { FirestoreImagesRepository } from '@/images/repository/firestore/firestore-images.repository';
import { Module } from '@nestjs/common';
import { FirestoreClient } from '@/config/firestore-client';
import { FirestorePromptModule } from '@/prompt/repository/firestore/firestore-prompt.module';
import { FirestoreUserModule } from '@/user/repository/firestore/firestore-user.module';

@Module({
  imports: [FirestorePromptModule, FirestoreUserModule],
  providers: [FirestoreClient, FirestoreImagesRepository],
  exports: [FirestoreImagesRepository],
})
export class FirestoreImagesModule {}
