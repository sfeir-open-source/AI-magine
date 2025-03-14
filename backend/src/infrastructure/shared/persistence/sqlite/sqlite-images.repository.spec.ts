import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { SqliteImagesRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-images.repository';
import { Image } from '@/core/domain/image/image';
import { ConfigurationService } from '@/infrastructure/shared/configuration/configuration.service';
import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';
import { ImageWithPromptTextAndAuthorDto } from '@/core/application/image/dto/image-with-prompt-text-and-author.dto';

const promptId = 'promptId1';
const mockImage = Image.create('http://example.com/image.png', promptId);

describe('SqliteImagesRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqliteImagesRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient({
      getSqliteDBPath: vi.fn().mockReturnValue(':memory:'),
    } as unknown as ConfigurationService);
    repository = new SqliteImagesRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('saveImage', () => {
    it('should save an image to the database', async () => {
      const runSpy = vi.spyOn(sqliteClient, 'run');

      const result = await repository.saveImage(mockImage);

      expect(runSpy).toHaveBeenCalled();
      expect(result).toEqual(mockImage);
    });
  });

  describe('getImageByPromptId', () => {
    it('should return an image by promptId', async () => {
      sqliteClient.get = vi.fn().mockResolvedValue(mockImage);

      const result = await repository.getImageByPromptId(promptId);

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toEqual(mockImage);
    });

    it('should return undefined if no image is found', async () => {
      sqliteClient.get = vi.fn().mockResolvedValue(undefined);

      const result = await repository.getImageByPromptId(promptId);

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('getImageByEventIdAndUserId', () => {
    it('returns image for event and user', async () => {
      const fakeImages = [
        {
          id: 'img-id',
          url: 'url',
          selected: false,
          promptId: 'prompt-id',
          prompt: 'test prompt',
          createdAt: new Date(),
        },
      ];

      sqliteClient.all = vi.fn().mockResolvedValue(fakeImages);

      const result = await repository.getImageByEventIdAndUserId(
        'event-id',
        'user-id'
      );

      expect(result).toEqual([
        new ImageWithPromptTextDto({
          createdAt: fakeImages[0].createdAt,
          id: fakeImages[0].id,
          prompt: fakeImages[0].prompt,
          promptId: fakeImages[0].promptId,
          selected: fakeImages[0].selected,
          url: fakeImages[0].url,
        }),
      ]);
    });
  });

  describe('getEventPromotedImages', () => {
    it('returns promoted image for event', async () => {
      const fakeImages = [
        {
          id: 'img-id',
          url: 'url',
          selected: true,
          promptId: 'prompt-id',
          prompt: 'test prompt',
          createdAt: new Date(),
          userNickname: 'nickname',
        },
      ];

      sqliteClient.all = vi.fn().mockResolvedValue(fakeImages);

      const result = await repository.getEventPromotedImages('event-id');

      expect(result).toEqual([
        new ImageWithPromptTextAndAuthorDto({
          createdAt: fakeImages[0].createdAt,
          id: fakeImages[0].id,
          prompt: fakeImages[0].prompt,
          promptId: fakeImages[0].promptId,
          selected: fakeImages[0].selected,
          url: fakeImages[0].url,
          author: fakeImages[0].userNickname,
        }),
      ]);
    });
  });

  describe('countImagesByEvent', () => {
    it('should return the count of images by event', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({ count: 2 });

      const result = await repository.countImagesByEvent('event-id');

      expect(result).toEqual(2);
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });
});
