import { Injectable } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { ImageGenerationStatus } from '@/core/domain/image-generation/image-generation-status';
import { ImageGenerationStatusRepository } from '@/core/domain/image-generation/image-generation-status.repository';
import { FirestorePromptRepository } from '@/infrastructure/shared/persistence/firestore/firestore-prompt.repository';
import { fetchDocumentsByChunks } from '@/infrastructure/shared/persistence/firestore/firestore.utils';

@Injectable()
export class FirestoreImageGenerationStatusRepository
  implements ImageGenerationStatusRepository
{
  private readonly imageGenerationStatusCollection: CollectionReference;

  constructor(
    private readonly firestoreClient: FirestoreClient,
    private readonly promptRepository: FirestorePromptRepository
  ) {
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

  private async getStatusesFromPromptIds(
    promptIds: string[],
    status: string
  ): Promise<ImageGenerationStatus[]> {
    const statusesSnapshot = await fetchDocumentsByChunks(
      this.imageGenerationStatusCollection,
      'promptId',
      promptIds,
      [['status', '==', status]]
    );

    return statusesSnapshot.map((doc) =>
      ImageGenerationStatus.from(
        doc.id,
        doc.get('promptId'),
        doc.get('status'),
        doc.get('payload'),
        new Date(doc.get('updatedAt'))
      )
    );
  }

  async countStatusByEvent(eventId: string, status: string): Promise<number> {
    const prompts = await this.promptRepository.getEventPrompts(eventId);

    return (
      await this.getStatusesFromPromptIds(
        prompts.map((prompt) => prompt.id),
        status
      )
    ).length;
  }
}
