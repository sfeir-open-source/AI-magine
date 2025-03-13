import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestorePromptRepository } from '@/infrastructure/shared/persistence/firestore/firestore-prompt.repository';
import { Mock } from 'vitest';
import { Prompt } from '@/core/domain/prompt/prompt';

describe('FirestorePromptRepository', () => {
  let firestoreClientMock: FirestoreClient;
  let collectionMock: CollectionReference;
  let firestorePromptRepository: FirestorePromptRepository;

  beforeEach(() => {
    collectionMock = {
      doc: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      count: vi.fn().mockReturnThis(),
      get: vi.fn(),
    } as unknown as CollectionReference;

    firestoreClientMock = {
      getCollection: vi.fn().mockReturnValue(collectionMock),
    } as unknown as FirestoreClient;

    firestorePromptRepository = new FirestorePromptRepository(
      firestoreClientMock
    );
  });

  describe('getEventPrompts', () => {
    it('returns empty array if no prompt found', async () => {
      (collectionMock.get as Mock).mockResolvedValue({
        empty: true,
      });

      const result =
        await firestorePromptRepository.getEventPrompts('event-id');

      expect(result).toEqual([]);
    });

    it('returns event prompts', async () => {
      (collectionMock.get as Mock).mockResolvedValue({
        empty: false,
        docs: [
          {
            id: '1',
            get: vi.fn((property: string) => {
              switch (property) {
                case 'eventId':
                  return 'event-id';
                case 'userId':
                  return 'user-id';
                case 'prompt':
                  return 'test prompt';
              }
            }),
          },
        ],
      });

      const result =
        await firestorePromptRepository.getEventPrompts('event-id');

      expect(result).toEqual([
        Prompt.from('1', 'event-id', 'user-id', 'test prompt'),
      ]);
    });
  });

  describe('getEventPromptsForUser', () => {
    it('returns empty array if no prompt found', async () => {
      (collectionMock.get as Mock).mockResolvedValue({
        empty: true,
      });

      const result = await firestorePromptRepository.getEventPromptsForUser(
        'event-id',
        'user-id'
      );

      expect(result).toEqual([]);
    });

    it('returns event prompts for user', async () => {
      (collectionMock.get as Mock).mockResolvedValue({
        empty: false,
        docs: [
          {
            id: '1',
            get: vi.fn((property: string) => {
              switch (property) {
                case 'eventId':
                  return 'event-id';
                case 'userId':
                  return 'user-id';
                case 'prompt':
                  return 'test prompt';
              }
            }),
          },
        ],
      });

      const result = await firestorePromptRepository.getEventPromptsForUser(
        'event-id',
        'user-id'
      );

      expect(collectionMock.where).toHaveBeenCalledWith(
        'userId',
        '==',
        'user-id'
      );
      expect(result).toEqual([
        Prompt.from('1', 'event-id', 'user-id', 'test prompt'),
      ]);
    });
  });

  describe('save', () => {
    it('should save a prompt and return it', async () => {
      const prompt = Prompt.create('event123', 'user123', 'Test prompt');
      const setMock = vi.fn();
      (collectionMock.doc as Mock).mockReturnValueOnce({ set: setMock });

      const result = await firestorePromptRepository.save(prompt);

      expect(collectionMock.doc).toHaveBeenCalledWith(prompt.id);
      expect(setMock).toHaveBeenCalledWith({
        eventId: prompt.eventId,
        userId: prompt.userId,
        prompt: prompt.prompt,
      });
      expect(result).toBe(prompt);
    });
  });

  describe('countByEventIdAndUserId', () => {
    it('should return the count of prompts for a given eventId and userId', async () => {
      const eventId = 'event123';
      const userId = 'user123';

      const countMock = { data: vi.fn(() => ({ count: 5 })) };
      (collectionMock.get as Mock).mockResolvedValueOnce(countMock);

      const result = await firestorePromptRepository.countByEventIdAndUserId(
        eventId,
        userId
      );

      expect(collectionMock.where).toHaveBeenCalledWith(
        'eventId',
        '==',
        eventId
      );
      expect(collectionMock.where).toHaveBeenCalledWith('userId', '==', userId);
      expect(collectionMock.get).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });
});
