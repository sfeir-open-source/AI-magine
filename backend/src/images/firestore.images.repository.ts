import { ImagesRepository } from '@/images/domain/images.repository';
import { Image } from '@/images/domain';
import { Inject, Injectable } from '@nestjs/common';
import { FirestoreClient } from '@/config/firestore-client';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class FirestoreImagesRepository implements ImagesRepository {
  private readonly imagesCollection: CollectionReference;
  private readonly promptsCollection: CollectionReference;

  constructor(
    @Inject()
    private readonly firestoreClient: FirestoreClient
  ) {
    this.imagesCollection = firestoreClient.getCollection('images');
    this.promptsCollection = firestoreClient.getCollection('prompts');
  }

  async getImageByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<Array<Image & { prompt: string }>> {
    const promptsSnapshot = await this.promptsCollection
      .where('userId', '==', userId)
      .where('eventId', '==', eventId)
      .get();

    if (promptsSnapshot.empty) {
      return [];
    }

    const promptIds = promptsSnapshot.docs.map((doc) => doc.id);

    const imagesSnapshot = await this.imagesCollection
      .where('promptId', 'in', promptIds)
      .get();

    if (imagesSnapshot.empty) {
      return [];
    }

    return imagesSnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
        selected: doc.get('selected') as boolean,
        createdAt: new Date(doc.get('createdAt')._seconds * 1000),
        url: doc.get('url'),
        promptId: doc.get('promptId'),
        prompt:
          promptsSnapshot.docs
            .find((promptDoc) => promptDoc.id === doc.get('promptId'))
            ?.get('prompt') || '',
      }))
      .map((image) => ({
        ...Image.from(
          image.id,
          image.url,
          image.promptId,
          image.createdAt,
          image.selected
        ),
        prompt: image.prompt,
      }));
  }

  async saveImage(image: Image): Promise<Image> {
    const { id, ...data } = image;
    await this.imagesCollection.doc(id).set(data);
    return image;
  }

  async getImageByPromptId(promptId: string): Promise<Image | undefined> {
    const rows = await this.imagesCollection
      .where('promptId', '==', promptId)
      .get();

    if (rows.empty) {
      return undefined;
    }
    const doc = rows.docs[0];
    return Image.from(
      doc.id,
      doc.get('url'),
      doc.get('promptId'),
      new Date(doc.get('createdAt')._seconds * 1000),
      doc.get('selected') as boolean
    );
  }
}
