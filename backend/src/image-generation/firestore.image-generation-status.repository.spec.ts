import {
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { FirestoreClient } from '@/config/firestore-client';

import { ImageGenerationStatus } from '@/image-generation/domain';
import { FirestoreImageGenerationStatusRepository } from '@/image-generation/firestore.image-generation-status.repository';

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
});
