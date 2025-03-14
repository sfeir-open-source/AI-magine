import { Module } from '@nestjs/common';
import { FirestoreEventsRepository } from '@/infrastructure/shared/persistence/firestore/firestore-events.repository';
import { FirestoreImagesRepository } from '@/infrastructure/shared/persistence/firestore/firestore-images.repository';
import { FirestorePromptRepository } from '@/infrastructure/shared/persistence/firestore/firestore-prompt.repository';
import { FirestoreUserRepository } from '@/infrastructure/shared/persistence/firestore/firestore-user.repository';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { FirestoreImageGenerationStatusRepository } from '@/infrastructure/shared/persistence/firestore/firestore.image-generation-status.repository';

@Module({
  providers: [
    FirestoreClient,
    FirestoreEventsRepository,
    FirestoreImagesRepository,
    FirestorePromptRepository,
    FirestoreUserRepository,
    FirestoreImageGenerationStatusRepository,
  ],
  exports: [
    FirestoreEventsRepository,
    FirestoreImagesRepository,
    FirestorePromptRepository,
    FirestoreUserRepository,
    FirestoreImageGenerationStatusRepository,
  ],
})
export class FirestoreModule {}
