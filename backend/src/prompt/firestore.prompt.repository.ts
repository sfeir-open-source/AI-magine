import { Inject, Injectable } from '@nestjs/common';
import { PromptRepository } from '@/prompt/domain';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestoreClient } from '@/config/firestore-client';
import { Prompt } from '@/prompt/domain/prompt.domain';

@Injectable()
export class FirestorePromptRepository implements PromptRepository {
  private readonly promptCollection: CollectionReference;

  constructor(
    @Inject()
    private readonly firestoreClient: FirestoreClient
  ) {
    this.promptCollection = firestoreClient.getCollection('prompts');
  }

  async save(prompt: Prompt): Promise<Prompt> {
    const { id, ...data } = prompt;
    await this.promptCollection.doc(id).set(data);
    return prompt;
  }

  async countByEventIdAndUserId(
    eventId: string,
    userId: string
  ): Promise<number> {
    const counter = await this.promptCollection
      .where('eventId', '==', eventId)
      .where('userId', '==', userId)
      .count()
      .get();
    return counter.data().count;
  }
}
