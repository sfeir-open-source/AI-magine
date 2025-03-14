import { Injectable } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { Prompt } from '@/core/domain/prompt/prompt';
import { IFirestorePromptRepository } from '@/core/domain/prompt/prompt.repository';

@Injectable()
export class FirestorePromptRepository implements IFirestorePromptRepository {
  private readonly promptCollection: CollectionReference;

  constructor(private readonly firestoreClient: FirestoreClient) {
    this.promptCollection = firestoreClient.getCollection('prompts');
  }

  async getEventPrompts(eventId: string): Promise<Prompt[]> {
    const promptsSnapshot = await this.promptCollection
      .where('eventId', '==', eventId)
      .get();

    if (promptsSnapshot.empty) {
      return [];
    }

    return promptsSnapshot.docs.map((promptDoc) =>
      Prompt.from(
        promptDoc.id,
        promptDoc.get('eventId'),
        promptDoc.get('userId'),
        promptDoc.get('prompt')
      )
    );
  }

  async getEventPromptsForUser(
    eventId: string,
    userId: string
  ): Promise<Prompt[]> {
    const promptsSnapshot = await this.promptCollection
      .where('userId', '==', userId)
      .where('eventId', '==', eventId)
      .get();

    if (promptsSnapshot.empty) {
      return [];
    }

    return promptsSnapshot.docs.map((promptDoc) =>
      Prompt.from(
        promptDoc.id,
        promptDoc.get('eventId'),
        promptDoc.get('userId'),
        promptDoc.get('prompt')
      )
    );
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
