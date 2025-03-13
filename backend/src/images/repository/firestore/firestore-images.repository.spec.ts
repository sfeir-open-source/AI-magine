import { Mock } from 'vitest';
import {
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { FirestoreClient } from '@/config/firestore-client';
import { FirestoreImagesRepository } from '@/images/repository/firestore/firestore-images.repository';
import { Image } from '@/images/domain';
import { FirestorePromptRepository } from '@/prompt/repository/firestore/firestore-prompt.repository';
import { FirestoreUserRepository } from '@/user/repository/firestore/firestore-user.repository';
import { Prompt } from '@/prompt/domain/prompt.domain';
import { ImageWithPromptTextDto } from '@/images/dto/ImageWithPromptText.dto';
import { User } from '@/user/domain';
import { ImageWithPromptTextAndAuthorDto } from '@/images/dto/ImageWithPromptTextAndAuthor.dto';

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
    it('returns images for event and user', async () => {
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
    it('should return images with prompt data if found', async () => {
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
});
