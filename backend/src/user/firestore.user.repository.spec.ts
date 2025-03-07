import { Mock, vi } from 'vitest';

import type { CollectionReference } from '@google-cloud/firestore';
import { FirestoreClient } from '@/config/firestore-client';
import { FirestoreUserRepository } from '@/user/firestore.user.repository';
import { User } from '@/user/domain';

vi.mock('@google-cloud/firestore', async () => ({
  CollectionReference: vi.fn(),
}));

describe('FirestoreUserRepository', () => {
  let mockFirestoreClient: FirestoreClient;
  let mockUserCollection: CollectionReference;
  let firestoreUserRepository: FirestoreUserRepository;

  beforeEach(() => {
    mockUserCollection = {
      where: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      doc: vi.fn().mockReturnThis(),
    } as unknown as CollectionReference;

    mockFirestoreClient = {
      getCollection: vi.fn().mockReturnValue(mockUserCollection),
    } as unknown as FirestoreClient;

    firestoreUserRepository = new FirestoreUserRepository(mockFirestoreClient);
  });

  describe('checkExists', () => {
    it('should return true if user exists in the collection', async () => {
      const mockDoc = { exists: true };
      (mockUserCollection.doc as Mock).mockReturnValueOnce({
        get: vi.fn().mockResolvedValueOnce(mockDoc),
      });

      const user = User.create({
        email: 'hashedEmail',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: 'nickname',
      });
      const exists = await firestoreUserRepository.checkExistsById(user.id);

      expect(mockUserCollection.doc).toHaveBeenCalledWith(user.id);
      expect(exists).toBe(true);
    });

    it('should return false if user does not exist in the collection', async () => {
      const mockDoc = { exists: false };
      (mockUserCollection.doc as Mock).mockReturnValueOnce({
        get: vi.fn().mockResolvedValueOnce(mockDoc),
      });

      const user = User.create({
        email: 'hashedEmail',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: 'nickname',
      });
      const exists = await firestoreUserRepository.checkExistsById(user.id);

      expect(mockUserCollection.doc).toHaveBeenCalledWith(user.id);
      expect(exists).toBe(false);
    });
  });

  describe('save', () => {
    it('should save the user and return it', async () => {
      const mockSet = vi.fn();
      (mockUserCollection.doc as Mock).mockReturnValueOnce({
        set: mockSet,
      });

      const user = User.create({
        email: 'hashedEmail',
        browserFingerprint: 'fingerprint',
        allowContact: true,
        nickname: 'nickname',
      });
      const savedUser = await firestoreUserRepository.save(user);

      expect(mockUserCollection.doc).toHaveBeenCalledWith(user.id);
      expect(mockSet).toHaveBeenCalledWith({
        email: user.email,
        browserFingerprint: user.browserFingerprint,
        nickname: user.nickname,
        allowContact: user.allowContact,
      });
      expect(savedUser).toEqual(user);
    });
  });

  describe('getUserIdByEmail', () => {
    it('should return user ID if a user with the specified email exists', async () => {
      const email = 'test@example.com';
      const mockDoc = { id: 'mockUserId' };
      (mockUserCollection.where as Mock).mockReturnValueOnce({
        get: vi.fn().mockResolvedValueOnce({ empty: false, docs: [mockDoc] }),
      });

      const userId = await firestoreUserRepository.getUserIdByEmail(email);

      expect(mockUserCollection.where).toHaveBeenCalledWith(
        'email',
        '==',
        email
      );
      expect(userId).toBe('mockUserId');
    });

    it('should return undefined if no user with the specified email exists', async () => {
      const email = 'test@example.com';
      (mockUserCollection.where as Mock).mockReturnValueOnce({
        get: vi.fn().mockResolvedValueOnce({ empty: true }),
      });

      const userId = await firestoreUserRepository.getUserIdByEmail(email);

      expect(mockUserCollection.where).toHaveBeenCalledWith(
        'email',
        '==',
        email
      );
      expect(userId).toBeUndefined();
    });
  });
});
