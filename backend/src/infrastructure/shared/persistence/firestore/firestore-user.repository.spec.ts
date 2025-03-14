import { Mock } from 'vitest';
import type { CollectionReference } from '@google-cloud/firestore';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { FirestoreUserRepository } from '@/infrastructure/shared/persistence/firestore/firestore-user.repository';
import { User } from '@/core/domain/user/user';
import { Prompt } from '@/core/domain/prompt/prompt';

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
      getAll: vi.fn(),
    } as unknown as FirestoreClient;

    firestoreUserRepository = new FirestoreUserRepository(mockFirestoreClient);
  });

  describe('checkExistsById', () => {
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
        hashedEmail: user.email,
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
        'hashedEmail',
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
        'hashedEmail',
        '==',
        email
      );
      expect(userId).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('returns undefined if no user with the specified email exists', async () => {
      (mockUserCollection.get as Mock).mockResolvedValue({
        empty: true,
      });

      const fakeEmail = 'test@example.com';
      const result = await firestoreUserRepository.getUserByEmail(fakeEmail);

      expect(result).toBeUndefined();
      expect(mockUserCollection.where).toHaveBeenCalledWith(
        'hashedEmail',
        '==',
        fakeEmail
      );
    });

    it('returns found user for email', async () => {
      const fakeEmail = 'test@example.com';

      (mockUserCollection.get as Mock).mockResolvedValue({
        empty: false,
        docs: [
          {
            id: '1',
            get: vi.fn((property: string) => {
              switch (property) {
                case 'hashedEmail':
                  return fakeEmail;
                case 'nickname':
                  return 'nickname';
                case 'browserFingerprint':
                  return 'fp';
                case 'allowContact':
                  return false;
              }
            }),
          },
        ],
      });

      const result = await firestoreUserRepository.getUserByEmail(fakeEmail);

      expect(result).toEqual(
        User.from({
          id: '1',
          email: fakeEmail,
          nickname: 'nickname',
          browserFingerprint: 'fp',
          allowContact: false,
        })
      );

      expect(mockUserCollection.where).toHaveBeenCalledWith(
        'hashedEmail',
        '==',
        fakeEmail
      );
    });
  });

  describe('getUsersById', () => {
    it('returns empty array if no user ids provided', async () => {
      const result = await firestoreUserRepository.getUsersById([]);

      expect(result).toEqual([]);
    });

    it('returns empty array if no users found', async () => {
      (mockFirestoreClient.getAll as Mock).mockResolvedValue([]);

      const result = await firestoreUserRepository.getUsersById([
        'user-id-1',
        'user-id-2',
      ]);

      expect(mockUserCollection.doc).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });

    it('returns found users', async () => {
      const getMock = (userId: string) =>
        vi.fn((property: string) => {
          switch (property) {
            case 'hashedEmail':
              return 'hashedEmail-' + userId;
            case 'browserFingerprint':
              return 'fp-' + userId;
            case 'allowContact':
              return false;
            case 'nickname':
              return 'nickname-' + userId;
          }
        });

      (mockFirestoreClient.getAll as Mock).mockResolvedValue([
        {
          id: 'user-id-1',
          get: getMock('user-id-1'),
        },
        {
          id: 'user-id-2',
          get: getMock('user-id-2'),
        },
      ]);

      const result = await firestoreUserRepository.getUsersById([
        'user-id-1',
        'user-id-2',
      ]);

      expect(mockUserCollection.doc).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        User.from({
          id: 'user-id-1',
          browserFingerprint: 'fp-user-id-1',
          email: 'hashedEmail-user-id-1',
          allowContact: false,
          nickname: 'nickname-user-id-1',
        }),
        User.from({
          id: 'user-id-2',
          browserFingerprint: 'fp-user-id-2',
          email: 'hashedEmail-user-id-2',
          allowContact: false,
          nickname: 'nickname-user-id-2',
        }),
      ]);
    });
  });

  describe('countUsersByEvent', () => {
    it('should return the correct count of unique user IDs for a given event ID', async () => {
      const mockEventId = 'event-1';
      const mockPrompts = [
        { get: vi.fn(() => 'user-1') },
        { get: vi.fn(() => 'user-2') },
        { get: vi.fn(() => 'user-1') }, // Duplicate user ID
      ];
      (mockFirestoreClient.getCollection as Mock).mockReturnValue({
        where: vi.fn().mockReturnValue({
          get: vi.fn().mockResolvedValue(mockPrompts),
        }),
      });

      const userCount =
        await firestoreUserRepository.countUsersByEvent(mockEventId);

      expect(mockFirestoreClient.getCollection).toHaveBeenCalledWith('prompts');
      expect(userCount).toBe(2);
    });

    it('should return 0 if no users are associated with the given event ID', async () => {
      const mockEventId = 'event-2';
      const mockPrompts: Prompt[] = [];
      (mockFirestoreClient.getCollection as Mock).mockReturnValue({
        where: vi.fn().mockReturnValue({
          get: vi.fn().mockResolvedValue(mockPrompts),
        }),
      });

      const userCount =
        await firestoreUserRepository.countUsersByEvent(mockEventId);

      expect(mockFirestoreClient.getCollection).toHaveBeenCalledWith('prompts');
      expect(userCount).toBe(0);
    });
  });
});
