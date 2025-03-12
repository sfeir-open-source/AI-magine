import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteImagesRepository } from '@/images/repository/sqlite/sqlite-images.repository';
import { Image } from '@/images/domain';
import { ConfigurationService } from '@/configuration/configuration.service';
import { ImageWithPromptTextDto } from '@/images/dto/ImageWithPromptText.dto';
import { ImageWithPromptTextAndAuthorDto } from '@/images/dto/ImageWithPromptTextAndAuthor.dto';

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
    it('returns images for event and user', async () => {
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
    it('returns promoted images for event', async () => {
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
});
