import { vi } from 'vitest';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { Image } from 'src/images/domain';

const promptId = 'promptId1';
const mockImage = Image.create('http://example.com/image.png', promptId);

describe('SqliteImagesRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqliteImagesRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient();
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
});
