import { fetchDocumentsByChunks } from '@/infrastructure/shared/persistence/firestore/firestore.utils';
import {
  CollectionReference,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore';
import { Mock } from 'vitest';

const mockCollection = {
  where: vi.fn().mockReturnThis(),
  get: vi.fn(),
} as unknown as CollectionReference;

const createMockDocument = (id: string, data: object) =>
  ({
    id,
    get: (key: string) => (data as Record<string, unknown>)[key],
  }) as QueryDocumentSnapshot;

describe('Firestore utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDocumentsByChunks', () => {
    it('should retrieve all the documents if less than 30 values', async () => {
      const mockDocs = [createMockDocument('1', { field: 'value1' })];
      (mockCollection.get as Mock).mockResolvedValue({
        forEach: (cb: () => void) => mockDocs.forEach(cb),
      });

      const result = await fetchDocumentsByChunks(mockCollection, 'field', [
        'val1',
      ]);

      expect(mockCollection.where).toHaveBeenCalledWith('field', 'in', [
        'val1',
      ]);
      expect(result).toEqual(mockDocs);
    });

    it('should divide requests by chunks of 30 items', async () => {
      const values = Array.from({ length: 35 }, (_, i) => `val${i}`);
      const mockDocs = values.map((v) => createMockDocument(v, { field: v }));

      (mockCollection.get as Mock)
        .mockResolvedValueOnce({
          forEach: (cb: () => void) => mockDocs.slice(0, 30).forEach(cb),
        })
        .mockResolvedValueOnce({
          forEach: (cb: () => void) => mockDocs.slice(30).forEach(cb),
        });

      const result = await fetchDocumentsByChunks(
        mockCollection,
        'field',
        values
      );

      expect(mockCollection.where).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(35);
    });

    it('should apply filters', async () => {
      const mockDocs = [
        createMockDocument('1', { field: 'value1', selected: true }),
      ];
      (mockCollection.get as Mock).mockResolvedValue({
        forEach: (cb: () => void) => mockDocs.forEach(cb),
      });

      const result = await fetchDocumentsByChunks(
        mockCollection,
        'field',
        ['val1'],
        [['selected', '==', true]]
      );

      expect(mockCollection.where).toHaveBeenCalledWith('field', 'in', [
        'val1',
      ]);
      expect(mockCollection.where).toHaveBeenCalledWith('selected', '==', true);
      expect(result).toEqual(mockDocs);
    });

    it('should return an empty array on no values', async () => {
      const result = await fetchDocumentsByChunks(mockCollection, 'field', []);
      expect(result).toEqual([]);
      expect(mockCollection.where).not.toHaveBeenCalled();
    });

    it('should handle Firestore error', async () => {
      (mockCollection.get as Mock).mockRejectedValue(
        new Error('Firestore error')
      );

      await expect(
        fetchDocumentsByChunks(mockCollection, 'field', ['val1'])
      ).rejects.toThrow('Firestore error');
    });
  });
});
