import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { FirestoreClient } from '@/config/firestore-client';
import { FirestoreImagesRepository } from '@/images/firestore.images.repository';
import { Image } from '@/images/domain';

vi.mock('@google-cloud/firestore');

describe('FirestoreImagesRepository', () => {
  let firestoreClientMock: FirestoreClient;
  let imagesCollectionMock: CollectionReference;
  let promptsCollectionMock: CollectionReference;
  let repository: FirestoreImagesRepository;

  beforeEach(() => {
    imagesCollectionMock = {
      where: vi.fn().mockReturnThis(),
      get: vi.fn(),
      doc: vi.fn(() => ({
        data: vi.fn(),
        set: vi.fn(),
      })),
    } as unknown as CollectionReference;

    promptsCollectionMock = {
      where: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      data: vi.fn().mockReturnThis(),
      find: vi.fn().mockReturnThis(),
      doc: vi.fn().mockReturnThis(),
    } as unknown as CollectionReference;

    firestoreClientMock = {
      getCollection: vi.fn((collectionName: string) => {
        return collectionName === 'images'
          ? imagesCollectionMock
          : promptsCollectionMock;
      }),
    } as unknown as FirestoreClient;

    repository = new FirestoreImagesRepository(firestoreClientMock);
  });

  describe('getImageByEventIdAndUserId', () => {
    it('should return an empty array if no prompts are found', async () => {
      vi.spyOn(promptsCollectionMock, 'get').mockResolvedValueOnce({
        empty: true,
        docs: [],
      } as unknown as QuerySnapshot);

      const result = await repository.getImageByEventIdAndUserId(
        'event1',
        'user1'
      );

      expect(result).toEqual([]);
      expect(promptsCollectionMock.where).toHaveBeenCalledWith(
        'userId',
        '==',
        'user1'
      );
      expect(promptsCollectionMock.where).toHaveBeenCalledWith(
        'eventId',
        '==',
        'event1'
      );
      expect(promptsCollectionMock.get).toHaveBeenCalled();
    });

    it('should return an empty array if no images are found', async () => {
      vi.spyOn(promptsCollectionMock, 'get').mockResolvedValueOnce({
        empty: false,
        docs: [{ id: 'prompt1' }],
      } as QuerySnapshot);

      vi.spyOn(imagesCollectionMock, 'get').mockResolvedValueOnce({
        empty: true,
        docs: [],
      } as unknown as QuerySnapshot);

      const result = await repository.getImageByEventIdAndUserId(
        'event1',
        'user1'
      );

      expect(result).toEqual([]);
      expect(imagesCollectionMock.where).toHaveBeenCalledWith(
        'promptId',
        'in',
        ['prompt1']
      );
      expect(imagesCollectionMock.get).toHaveBeenCalled();
    });

    it('should return images with prompt data if found', async () => {
      const seconds = 1696540800;
      vi.spyOn(promptsCollectionMock, 'get').mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            id: 'prompt1',
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                text: 'Sample Prompt',
              };
              return fields[field];
            },
          },
        ],
      } as unknown as QuerySnapshot);

      vi.spyOn(imagesCollectionMock, 'get').mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            id: 'image1',
            data: () => ({
              url: 'https://test.image',
              promptId: 'prompt1',
              createdAt: { _seconds: seconds },
              selected: false,
            }),
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                url: 'https://test.image',
                promptId: 'prompt1',
                createdAt: { _seconds: seconds },
                selected: false,
              };
              return fields[field];
            },
          },
        ],
      } as unknown as QuerySnapshot);

      const result = await repository.getImageByEventIdAndUserId(
        'event1',
        'user1'
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('image1');
      expect(result[0].prompt).toBe('Sample Prompt');
      expect(result[0].url).toBe('https://test.image');
      expect(result[0].createdAt).toEqual(new Date(seconds * 1000));
      expect(result[0].selected).toBe(false);
    });
  });

  describe('saveImage', () => {
    it('should save an image and return it', async () => {
      const testImage = Image.create('https://image.url', 'prompt1', false);

      const mockSet = vi.fn();
      vi.spyOn(imagesCollectionMock, 'doc').mockReturnValueOnce({
        set: mockSet,
      } as unknown as DocumentReference);

      const result = await repository.saveImage(testImage);

      expect(result).toBe(testImage);
      expect(imagesCollectionMock.doc).toHaveBeenCalledWith(testImage.id);
      expect(mockSet).toHaveBeenCalledWith({
        url: testImage.url,
        promptId: testImage.promptId,
        createdAt: testImage.createdAt,
        selected: testImage.selected,
      });
    });
  });

  describe('getImageByPromptId', () => {
    it('should return undefined if no image is found', async () => {
      vi.spyOn(imagesCollectionMock, 'get').mockResolvedValueOnce({
        empty: true,
        docs: [],
      } as unknown as QuerySnapshot);

      const result = await repository.getImageByPromptId('prompt1');

      expect(result).toBeUndefined();
      expect(imagesCollectionMock.where).toHaveBeenCalledWith(
        'promptId',
        '==',
        'prompt1'
      );
      expect(imagesCollectionMock.get).toHaveBeenCalled();
    });

    it('should return an Image if a document is found', async () => {
      vi.spyOn(imagesCollectionMock, 'get').mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            id: 'image1',
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                url: 'https://test.image',
                promptId: 'prompt1',
                createdAt: { _seconds: 1696540800 },
                selected: true,
              };
              return fields[field];
            },
          },
        ],
      } as unknown as QuerySnapshot);

      const result = await repository.getImageByPromptId('prompt1');

      expect(result?.id).toBe('image1');
      expect(result?.url).toBe('https://test.image');
      expect(result?.promptId).toBe('prompt1');
      expect(result?.createdAt).toEqual(new Date(1696540800 * 1000));
      expect(result?.selected).toBe(true);
    });
  });
});
