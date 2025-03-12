import { Inject, Injectable } from '@nestjs/common';
import { IFirestoreUserRepository, User } from '@/user/domain';
import { FirestoreClient } from '@/config/firestore-client';
import {
  CollectionReference,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore';

@Injectable()
export class FirestoreUserRepository implements IFirestoreUserRepository {
  private userCollection: CollectionReference;

  constructor(
    @Inject()
    private readonly firestoreClient: FirestoreClient
  ) {
    this.userCollection = firestoreClient.getCollection('users');
  }

  private fromQueryDocumentSnapshotToUser(
    queryDocumentSnapshot: QueryDocumentSnapshot
  ): User {
    return User.from({
      id: queryDocumentSnapshot.id,
      email: queryDocumentSnapshot.get('hashedEmail'),
      browserFingerprint: queryDocumentSnapshot.get('browserFingerprint'),
      allowContact: queryDocumentSnapshot.get('allowContact') as boolean,
      nickname: queryDocumentSnapshot.get('nickname'),
    });
  }

  async checkExistsById(userId: string): Promise<boolean> {
    const searchedUser = await this.userCollection.doc(userId).get();
    return searchedUser.exists;
  }

  async getUserByEmail(hashedEmail: string): Promise<User | undefined> {
    const searchedUser = await this.userCollection
      .where('hashedEmail', '==', hashedEmail)
      .get();

    if (searchedUser.empty) {
      return undefined;
    }

    const doc = searchedUser.docs[0];

    return this.fromQueryDocumentSnapshotToUser(doc);
  }

  async save(user: User): Promise<User> {
    const { id, ...data } = user;
    await this.userCollection.doc(id).set(data);
    return user;
  }

  async getUserIdByEmail(hashedEmail: string): Promise<string | undefined> {
    const searchedUser = await this.userCollection
      .where('hashedEmail', '==', hashedEmail)
      .get();
    if (searchedUser.empty) {
      return undefined;
    }
    return searchedUser.docs[0].id;
  }

  async getUsersById(userIds: string[]): Promise<User[]> {
    if (userIds.length === 0) return [];

    const docs = userIds.map((id) => this.userCollection.doc(id));
    const userDocuments = await this.firestoreClient.getAll(docs);

    if (userDocuments.length === 0) {
      return [];
    }

    return userDocuments.map(this.fromQueryDocumentSnapshotToUser);
  }
}
