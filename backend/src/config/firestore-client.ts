import { Inject, Injectable } from '@nestjs/common';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  ReadOptions,
} from '@google-cloud/firestore';
import { ConfigurationService } from '@/configuration/configuration.service';

@Injectable()
export class FirestoreClient {
  private readonly client: Firestore;
  private readonly collectionPrefix = 'ai-magine-v2_';

  constructor(
    @Inject()
    private readonly configurationService: ConfigurationService
  ) {
    this.client = new Firestore({
      projectId: configurationService.getFirestoreGcpProjectId(),
    });
  }

  getCollection(name: string): CollectionReference {
    return this.client.collection(this.collectionPrefix + name);
  }

  getAll(documentRefsOrReadOptions: Array<DocumentReference | ReadOptions>) {
    return this.client.getAll(...documentRefsOrReadOptions);
  }
}
