import { ImagesRepository } from '@/images/domain/images.repository';
import { Image } from '@/images/domain';
import { Injectable } from '@nestjs/common';
import { FirestoreClient } from '@/config/firestore-client';
import {
  CollectionReference,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore';
import { FirestorePromptRepository } from '@/prompt/repository/firestore/firestore-prompt.repository';
import { ImageWithPromptTextDto } from '@/images/dto/ImageWithPromptText.dto';
import { FirestoreUserRepository } from '@/user/repository/firestore/firestore-user.repository';
import { ImageWithPromptTextAndAuthorDto } from '@/images/dto/ImageWithPromptTextAndAuthor.dto';
import { uniq } from '@/utils';

@Injectable()
export class FirestoreImagesRepository implements ImagesRepository {
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

    const images = await this.getImagesFromPromptIds(promptIds);

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

  private async getImagesFromPromptIds(promptIds: string[]): Promise<Image[]> {
    const chunkSize = 30; // Firestore cannot handle more than 30 values with "IN"

    const imagesSnapshot: QueryDocumentSnapshot[] = [];

    for (let i = 0; i < promptIds.length; i += chunkSize) {
      const chunk = promptIds.slice(i, i + chunkSize);
      const querySnapshot = await this.imagesCollection
        .where('promptId', 'in', chunk)
        .where('selected', '==', true)
        .get();

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
