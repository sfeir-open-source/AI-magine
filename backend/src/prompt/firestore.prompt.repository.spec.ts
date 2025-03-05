import { FirestoreClient } from '@/config/firestore-client';
import { CollectionReference } from '@google-cloud/firestore';
import { FirestorePromptRepository } from '@/prompt/firestore.prompt.repository';
import { Mock, vi } from 'vitest';
import { Prompt } from '@/prompt/domain/prompt.domain';

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
