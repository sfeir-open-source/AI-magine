import { ImageRepository } from '@/core/domain/image/image.repository';
import { Image } from '@/core/domain/image/image';
import { Injectable } from '@nestjs/common';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import {
  CollectionReference,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore';
import { FirestorePromptRepository } from '@/infrastructure/shared/persistence/firestore/firestore-prompt.repository';
import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';
import { FirestoreUserRepository } from '@/infrastructure/shared/persistence/firestore/firestore-user.repository';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';
import { uniq } from '@/utils';

@Injectable()
export class FirestoreImagesRepository implements ImageRepository {
  private readonly imagesCollection: CollectionReference;

  constructor(
    private readonly firestoreClient: FirestoreClient,
    private readonly promptRepository: FirestorePromptRepository,
    private readonly userRepository: FirestoreUserRepository
  ) {
    this.imagesCollection = firestoreClient.getCollection('images');
  }

  async getEventPromotedImages(
    eventId: string
  ): Promise<ImageWithPromptTextAndAuthorDto[]> {
    const prompts = await this.promptRepository.getEventPrompts(eventId);

    const promptIds = prompts.map((prompt) => prompt.id);

    const userIds = uniq(prompts.map((prompt) => prompt.userId));

    const users = await this.userRepository.getUsersById(userIds);

    const images = await this.getImagesFromPromptIds(promptIds, true);

    return images.map((image) => {
      const prompt = prompts.find((prompt) => prompt.id === image.promptId);
      const user = users.find((user) => user.id === prompt?.userId);

      return new ImageWithPromptTextAndAuthorDto({
        ...image,
        prompt: prompt?.prompt ?? '',
        author: user?.nickname ?? '',
      });
    });
  }

  async getImageByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<ImageWithPromptTextDto[]> {
    const prompts = await this.promptRepository.getEventPromptsForUser(
      eventId,
      userId
    );

    const promptIds = prompts.map((doc) => doc.id);

    const images = await this.getImagesFromPromptIds(promptIds);

    return images.map(
      (image) =>
        new ImageWithPromptTextDto({
          ...image,
          prompt:
            prompts.find((prompt) => prompt.id === image.promptId)?.prompt ||
            '',
        })
    );
  }

  async saveImage(image: Image): Promise<Image> {
    const { id, ...data } = image;
    await this.imagesCollection.doc(id).set(data);
    return image;
  }

  private async getImagesFromPromptIds(
    promptIds: string[],
    filterOnSelected: boolean = false
  ): Promise<Image[]> {
    const chunkSize = 30; // Firestore cannot handle more than 30 values with "IN"

    const imagesSnapshot: QueryDocumentSnapshot[] = [];

    for (let i = 0; i < promptIds.length; i += chunkSize) {
      const chunk = promptIds.slice(i, i + chunkSize);
      let query = this.imagesCollection.where('promptId', 'in', chunk);

      if (filterOnSelected) {
        query = query.where('selected', '==', true);
      }

      const querySnapshot = await query.get();

      querySnapshot.forEach((doc) => {
        imagesSnapshot.push(doc);
      });
    }

    if (imagesSnapshot.length === 0) {
      return [];
    }

    return imagesSnapshot.map((doc) =>
      Image.from(
        doc.id,
        doc.get('url'),
        doc.get('promptId'),
        new Date(doc.get('createdAt')._seconds * 1000),
        doc.get('selected') as boolean
      )
    );
  }
}
