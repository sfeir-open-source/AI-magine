import {
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { FirestoreImageGenerationStatusRepository } from '@/infrastructure/shared/persistence/firestore/firestore.image-generation-status.repository';
import { ImageGenerationStatus } from '@/core/domain/image-generation/image-generation-status';
import { Mock } from 'vitest';

vi.mock('@google-cloud/firestore', () => ({
  CollectionReference: vi.fn(),
  QuerySnapshot: vi.fn(),
  QueryDocumentSnapshot: vi.fn(),
  DocumentReference: vi.fn(),
}));

describe('FirestoreImageGenerationStatusRepository', () => {
  let firestoreClientMock: FirestoreClient;
  let repository: FirestoreImageGenerationStatusRepository;
  let mockCollection: CollectionReference;
  const eventId = 'event-id';
  const mockPromptDocs = [
    { id: 'prompt-id', eventId },
    { id: 'prompt-id-2', eventId },
    { id: 'prompt-id-3', eventId: 'event-id-2' },
  ].map((doc) => ({ id: doc.id, data: () => doc }));

  beforeEach(() => {
    mockCollection = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn(),
      doc: vi.fn(() => ({
        set: vi.fn(),
      })),
    } as unknown as CollectionReference;

    firestoreClientMock = {
      getCollection: vi.fn().mockReturnValue(mockCollection),
    } as unknown as FirestoreClient;

    repository = new FirestoreImageGenerationStatusRepository(
      firestoreClientMock
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getPromptGenerationStatus', () => {
    it('should return undefined if no document is found', async () => {
      const mockQuerySnapshot = { empty: true } as unknown as QuerySnapshot;
      vi.spyOn(mockCollection, 'get').mockResolvedValue(mockQuerySnapshot);

      const result =
        await repository.getPromptGenerationStatus('test-prompt-id');

      expect(result).toBeUndefined();
      expect(mockCollection.where).toHaveBeenCalledWith(
        'promptId',
        '==',
        'test-prompt-id'
      );
      expect(mockCollection.orderBy).toHaveBeenCalledWith('updatedAt', 'desc');
      expect(mockCollection.limit).toHaveBeenCalledWith(1);
      expect(mockCollection.get).toHaveBeenCalledTimes(1);
    });

    it('should return an ImageGenerationStatus instance if a matching document is found', async () => {
      const mockDocument = {
        id: 'test-id',
        get: vi.fn((field: string) => {
          const mockData = {
            promptId: 'test-prompt-id',
            status: 'pending',
            payload: 'test-payload',
            updatedAt: { _seconds: 1696540800 },
          };
          return mockData[field as keyof typeof mockData];
        }),
      };

      const mockQuerySnapshot = {
        empty: false,
        docs: [mockDocument as unknown as QueryDocumentSnapshot],
      } as unknown as QuerySnapshot;
      vi.spyOn(mockCollection, 'get').mockResolvedValue(mockQuerySnapshot);

      const result =
        await repository.getPromptGenerationStatus('test-prompt-id');

      expect(result).toEqual(
        ImageGenerationStatus.from(
          'test-id',
          'test-prompt-id',
          'pending',
          'test-payload',
          new Date(1696540800 * 1000)
        )
      );
      expect(mockCollection.where).toHaveBeenCalledWith(
        'promptId',
        '==',
        'test-prompt-id'
      );
      expect(mockCollection.orderBy).toHaveBeenCalledWith('updatedAt', 'desc');
      expect(mockCollection.limit).toHaveBeenCalledWith(1);
      expect(mockCollection.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePromptGenerationStatus', () => {
    it('should add a new ImageGenerationStatus to the collection and return it', async () => {
      const mockDocRef = { set: vi.fn() } as unknown as DocumentReference;
      vi.spyOn(mockCollection, 'doc').mockReturnValue(mockDocRef);

      const promptId = 'test-prompt-id';
      const status = 'success';
      const payload = 'test-payload';

      const result = await repository.updatePromptGenerationStatus(
        promptId,
        status,
        payload
      );

      const expectedDocumentData = {
        promptId,
        status,
        payload,
        updatedAt: expect.any(Date),
      };

      expect(mockCollection.doc).toHaveBeenCalledWith(result.id);
      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining(expectedDocumentData)
      );

      expect(result.promptId).toBe(promptId);
      expect(result.status).toBe(status);
      expect(result.payload).toBe(payload);
    });
  });

  describe('countStatusByEvent', () => {
    it('should return 0 when no matching prompts are found for the given event', async () => {
      (firestoreClientMock.getCollection as Mock).mockImplementation(
        (collectionName) => {
          if (collectionName === 'prompts') {
            return {
              where: vi.fn().mockReturnThis(),
              get: vi.fn().mockResolvedValue({ docs: mockPromptDocs }),
            };
          }
        }
      );
      (mockCollection.get as Mock).mockResolvedValue({
        forEach: vi.fn(),
      });

      const result = await repository.countStatusByEvent(
        'non-existent-event',
        'completed'
      );

      expect(result).toBe(0);
    });

    it('should call getStatusesFromPromptIds and return the correct count when matching prompts and statuses are found', async () => {
      (firestoreClientMock.getCollection as Mock).mockImplementation(
        (collectionName) => {
          if (collectionName === 'prompts') {
            return {
              where: vi.fn().mockReturnThis(),
              get: vi.fn().mockResolvedValue({ docs: mockPromptDocs }),
            };
          }
        }
      );
      (mockCollection.get as Mock).mockResolvedValue({
        forEach: vi.fn((cb) => {
          cb({
            id: 'prompt-id-1',
            data: () => ({
              promptId: 'prompt-id-1',
              status: 'completed',
            }),
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                promptId: 'prompt-id-1',
                status: 'completed',
              };
              return fields[field];
            },
          });
        }),
      });

      const result = await repository.countStatusByEvent(
        'test-event-id',
        'completed'
      );

      expect(result).toBe(1);
    });
  });
});
