import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { SqliteImageGenerationStatusRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite.image-generation-status.repository';
import { ConfigurationService } from '@/infrastructure/shared/configuration/configuration.service';
import { ImageGenerationStatus } from '@/core/domain/image-generation/image-generation-status';

const now = new Date();
const promptId = 'PromptId1';
const mockImageGenerationStatus = ImageGenerationStatus.from(
  '1',
  promptId,
  'status',
  'payload',
  now
);

describe('SqliteImageGenerationStatusRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqliteImageGenerationStatusRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient({
      getSqliteDBPath: () => ':memory:',
    } as unknown as ConfigurationService);
    repository = new SqliteImageGenerationStatusRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('getPromptGenerationStatus', () => {
    it('should return undefined if no matching record is found', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValueOnce(undefined);

      const result =
        await repository.getPromptGenerationStatus('non-existent-id');

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return ImageGenerationStatus if entry is found', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValueOnce({
        id: '1',
        promptId,
        status: 'status',
        payload: 'payload',
        updatedAt: now,
      });

      const result = await repository.getPromptGenerationStatus(promptId);

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toEqual(mockImageGenerationStatus);
    });
  });

  describe('updatePromptGenerationStatus', () => {
    it('should insert a new status and return the ImageGenerationStatus instance', async () => {
      vi.spyOn(ImageGenerationStatus, 'create').mockReturnValue(
        mockImageGenerationStatus
      );
      vi.spyOn(sqliteClient, 'run').mockResolvedValueOnce(undefined);

      const result = await repository.updatePromptGenerationStatus(
        promptId,
        'IN_PROGRESS',
        'test payload'
      );

      expect(ImageGenerationStatus.create).toHaveBeenCalledWith(
        promptId,
        'IN_PROGRESS',
        'test payload'
      );
      expect(sqliteClient.run).toHaveBeenCalled();
      expect(result).toEqual(mockImageGenerationStatus);
    });
  });

  describe('countStatusByEvent', () => {
    it('should return 0 if no matching records are found', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValueOnce({ count: 0 });

      const result = await repository.countStatusByEvent(
        'event-id',
        'COMPLETED'
      );

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should return the count of matching records', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValueOnce({ count: 5 });

      const result = await repository.countStatusByEvent(
        'event-id',
        'COMPLETED'
      );

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });
});
