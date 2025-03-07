import { Inject, Injectable } from '@nestjs/common';
import { User, UserRepository } from '@/user/domain';
import { FirestoreClient } from '@/config/firestore-client';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class FirestoreUserRepository implements UserRepository {
  private userCollection: CollectionReference;

  constructor(
    @Inject()
    private readonly firestoreClient: FirestoreClient
  ) {
    this.userCollection = firestoreClient.getCollection('users');
  }

  async checkExistsById(userId: string): Promise<boolean> {
    const searchedUser = await this.userCollection.doc(userId).get();
    return searchedUser.exists;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const searchedUser = await this.userCollection
      .where('email', '==', email)
      .get();
    if (searchedUser.empty) {
      return undefined;
    }
    const doc = searchedUser.docs[0];
    return User.from({
      id: doc.id,
      email: doc.get('email'),
      nickname: doc.get('nickname'),
      browserFingerprint: doc.get('browserFingerprint'),
      allowContact: doc.get('allowContact'),
    });
  }

  async save(user: User): Promise<User> {
    const { id, ...data } = user;
    await this.userCollection.doc(id).set(data);
    return user;
  }

  async getUserIdByEmail(email: string): Promise<string | undefined> {
    const searchedUser = await this.userCollection
      .where('email', '==', email)
      .get();
    if (searchedUser.empty) {
      return undefined;
    }
    return searchedUser.docs[0].id;
  }
}
