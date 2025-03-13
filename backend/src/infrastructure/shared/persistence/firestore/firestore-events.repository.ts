import { Injectable } from '@nestjs/common';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { CollectionReference } from '@google-cloud/firestore';
import { SfeirEventRepository } from '@/core/domain/sfeir-event/sfeir-event.repository';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';

@Injectable()
export class FirestoreEventsRepository implements SfeirEventRepository {
  private readonly sfeirEventsCollection: CollectionReference;

  constructor(private readonly firestoreClient: FirestoreClient) {
    this.sfeirEventsCollection =
      this.firestoreClient.getCollection('sfeir-event');
  }

  async getSfeirEvents(): Promise<SfeirEvent[]> {
    const rows = await this.sfeirEventsCollection.get();
    return rows.docs.map((storedEvent) =>
      SfeirEvent.from(
        storedEvent.id,
        storedEvent.get('name'),
        storedEvent.get('allowedPrompts'),
        new Date(storedEvent.get('startDate')._seconds * 1000),
        new Date(storedEvent.get('endDate')._seconds * 1000)
      )
    );
  }

  async saveSfeirEvent(sfeirEvent: SfeirEvent): Promise<SfeirEvent> {
    const { id, ...data } = sfeirEvent;
    await this.sfeirEventsCollection.doc(id).set(data);
    return sfeirEvent;
  }

  async deleteSfeirEvent(id: string): Promise<void> {
    const row = await this.sfeirEventsCollection.doc(id).get();

    if (row.exists) {
      await row.ref.delete();
    } else {
      throw new Error(`No event found with id: ${id}`);
    }
  }

  async getSfeirEvent(id: string): Promise<SfeirEvent | undefined> {
    const row = await this.sfeirEventsCollection.doc(id).get();
    if (!row.exists) {
      return undefined;
    }
    return SfeirEvent.from(
      id,
      row.get('name'),
      row.get('allowedPrompts'),
      new Date(row.get('startDate')._seconds * 1000),
      new Date(row.get('endDate')._seconds * 1000)
    );
  }
}
