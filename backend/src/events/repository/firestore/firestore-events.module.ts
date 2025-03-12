import { Module } from '@nestjs/common';
import { FirestoreClient } from '@/config/firestore-client';
import { FirestoreEventsRepository } from '@/events/repository/firestore/firestore-events.repository';

@Module({
  providers: [FirestoreClient, FirestoreEventsRepository],
  exports: [FirestoreEventsRepository],
})
export class FirestoreEventsModule {}
