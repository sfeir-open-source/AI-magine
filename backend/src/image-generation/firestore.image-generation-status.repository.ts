import {
  ImageGenerationStatus,
  ImageGenerationStatusRepository,
} from '@/image-generation/domain';
import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestoreClient } from '@/config/firestore-client';

@Injectable()
export class FirestoreImageGenerationStatusRepository
  implements ImageGenerationStatusRepository
{
  private readonly imageGenerationStatusCollection: CollectionReference;

  constructor(@Inject() private readonly firestoreClient: FirestoreClient) {
    this.imageGenerationStatusCollection = firestoreClient.getCollection(
      'image-generation-status'
    );
  }

  async getPromptGenerationStatus(
    promptId: string
  ): Promise<ImageGenerationStatus | undefined> {
    const rows = await this.imageGenerationStatusCollection
      .where('promptId', '==', promptId)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    if (rows.empty) return undefined;
    const doc = rows.docs[0];
    return ImageGenerationStatus.from(
      doc.id,
      doc.get('promptId'),
      doc.get('status'),
      doc.get('payload') ?? '',
      new Date(doc.get('updatedAt')._seconds * 1000)
    );
  }

  async updatePromptGenerationStatus(
    promptId: string,
    status: string,
    payload = ''
  ): Promise<ImageGenerationStatus> {
    const newImageGenerationStatus = ImageGenerationStatus.create(
      promptId,
      status,
      payload
    );
    const { id, ...data } = newImageGenerationStatus;
    await this.imageGenerationStatusCollection.doc(id).set(data);

    return newImageGenerationStatus;
  }
}
