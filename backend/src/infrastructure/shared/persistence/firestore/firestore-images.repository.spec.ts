import { expect, Mock } from 'vitest';
import {
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { FirestoreClient } from '@/infrastructure/shared/persistence/firestore/firestore-client';
import { FirestoreImagesRepository } from '@/infrastructure/shared/persistence/firestore/firestore-images.repository';
import { FirestorePromptRepository } from '@/infrastructure/shared/persistence/firestore/firestore-prompt.repository';
import { FirestoreUserRepository } from '@/infrastructure/shared/persistence/firestore/firestore-user.repository';
import { Prompt } from '@/core/domain/prompt/prompt';
import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';
import { User } from '@/core/domain/user/user';
import { Image } from '@/core/domain/image/image';

vi.mock('@google-cloud/firestore');

describe('FirestoreImagesRepository', () => {
  let firestoreClientMock: FirestoreClient;
  let imagesCollectionMock: CollectionReference;
  let promptsRepositoryMock: FirestorePromptRepository;
  let usersRepositoryMock: FirestoreUserRepository;
  let imagesRepository: FirestoreImagesRepository;

  beforeEach(() => {
    imagesCollectionMock = {
      where: vi.fn().mockReturnThis(),
      get: vi.fn(),
      doc: vi.fn(() => ({
        data: vi.fn(),
        set: vi.fn(),
      })),
    } as unknown as CollectionReference;

    promptsRepositoryMock = {
      getEventPromptsForUser: vi.fn(),
      getEventPrompts: vi.fn(),
    } as unknown as FirestorePromptRepository;

    usersRepositoryMock = {
      getUsersById: vi.fn(),
    } as unknown as FirestoreUserRepository;

    firestoreClientMock = {
      getCollection: vi.fn().mockReturnValue(imagesCollectionMock),
    } as unknown as FirestoreClient;

    imagesRepository = new FirestoreImagesRepository(
      firestoreClientMock,
      promptsRepositoryMock,
      usersRepositoryMock
    );
  });

  describe('getImageByEventIdAndUserId', () => {
    it('returns image for event and user', async () => {
      (promptsRepositoryMock.getEventPromptsForUser as Mock).mockResolvedValue([
        Prompt.from('1', 'evt-id', 'usr-id', 'test prompt'),
      ]);

      const seconds = 1696540800;
      (imagesCollectionMock.get as Mock).mockResolvedValue({
        forEach: vi.fn((cb) => {
          cb({
            id: 'image1',
            data: () => ({
              url: 'https://test.image',
              promptId: '1',
              createdAt: { _seconds: seconds },
              selected: false,
            }),
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                url: 'https://test.image',
                promptId: '1',
                createdAt: { _seconds: seconds },
                selected: false,
              };
              return fields[field];
            },
          });
        }),
      } as unknown as QuerySnapshot);

      const result = await imagesRepository.getImageByEventIdAndUserId(
        'event1',
        'user1'
      );

      expect(result).toHaveLength(1);
      expect(result).toEqual([
        new ImageWithPromptTextDto({
          promptId: '1',
          id: 'image1',
          prompt: 'test prompt',
          url: 'https://test.image',
          createdAt: new Date(seconds * 1000),
          selected: false,
        }),
      ]);
    });
  });

  describe('getEventPromotedImages', () => {
    it('should return image with prompt data if found', async () => {
      (promptsRepositoryMock.getEventPrompts as Mock).mockResolvedValue([
        Prompt.from('prompt-id', 'evt-id', 'user-id', 'test prompt'),
      ]);

      (usersRepositoryMock.getUsersById as Mock).mockResolvedValue([
        User.from({
          id: 'user-id',
          email: 'foo@foo.com',
          nickname: 'nickname',
          browserFingerprint: 'fp',
          allowContact: false,
        }),
      ]);

      const seconds = 1696540800;
      (imagesCollectionMock.get as Mock).mockResolvedValue({
        forEach: vi.fn((cb) => {
          cb({
            id: 'image1',
            data: () => ({
              url: 'https://test.image',
              promptId: 'prompt-id',
              userId: 'user-id',
              createdAt: { _seconds: seconds },
              selected: false,
            }),
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                url: 'https://test.image',
                promptId: 'prompt-id',
                userId: 'user-id',
                createdAt: { _seconds: seconds },
                selected: false,
              };
              return fields[field];
            },
          });
        }),
      } as unknown as QuerySnapshot);

      const result = await imagesRepository.getEventPromotedImages('event1');

      expect(result).toHaveLength(1);
      expect(result).toEqual([
        new ImageWithPromptTextAndAuthorDto({
          promptId: 'prompt-id',
          id: 'image1',
          prompt: 'test prompt',
          url: 'https://test.image',
          createdAt: new Date(seconds * 1000),
          selected: false,
          author: 'nickname',
        }),
      ]);
    });
  });

  describe('saveImage', () => {
    it('saves an image and return it', async () => {
      const testImage = Image.create('https://image.url', 'prompt1', false);

      const mockSet = vi.fn();
      vi.spyOn(imagesCollectionMock, 'doc').mockReturnValueOnce({
        set: mockSet,
      } as unknown as DocumentReference);

      const result = await imagesRepository.saveImage(testImage);

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

  describe('countImagesByEvent', () => {
    it('returns the correct count of images for an event', async () => {
      const eventId = 'event-id';
      const seconds = 1696540800;

      (promptsRepositoryMock.getEventPrompts as Mock).mockResolvedValue([
        { id: 'prompt-id', eventId },
        { id: 'prompt-id-2', eventId },
        { id: 'prompt-id-3', eventId: 'event-id-2' },
      ]);
      (imagesCollectionMock.get as Mock).mockResolvedValue({
        forEach: vi.fn((cb) => {
          cb({
            id: 'image1',
            data: () => ({
              url: 'https://test.image',
              promptId: 'prompt-id',
              userId: 'user-id',
              createdAt: { _seconds: seconds },
              selected: false,
            }),
            get: (field: string) => {
              const fields: Record<string, unknown> = {
                url: 'https://test.image',
                promptId: 'prompt-id',
                userId: 'user-id',
                createdAt: { _seconds: seconds },
                selected: false,
              };
              return fields[field];
            },
          });
        }),
      });

      const result = await imagesRepository.countImagesByEvent(eventId);

      expect(result).toBe(1);
    });

    it('returns 0 when there are no associated images', async () => {
      const eventId = 'event-id';

      (promptsRepositoryMock.getEventPrompts as Mock).mockResolvedValue([
        { id: 'prompt-id', eventId },
        { id: 'prompt-id-2', eventId },
        { id: 'prompt-id-3', eventId: 'event-id-2' },
      ]);
      (imagesCollectionMock.get as Mock).mockResolvedValue({
        forEach: vi.fn(() => {}),
      });

      const result = await imagesRepository.countImagesByEvent('event1');

      expect(result).toBe(0);
    });
  });
});
