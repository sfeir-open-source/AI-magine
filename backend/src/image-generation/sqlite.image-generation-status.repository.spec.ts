import { vi } from 'vitest';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteImageGenerationStatusRepository } from '@/image-generation/sqlite.image-generation-status.repository';
import { ImageGenerationStatus } from '@/image-generation/image-generation-types';

vi.mock('./sqlite.image-generation-status.repository', async () => {
  const originalModule = await vi.importActual<
    typeof import('./sqlite.image-generation-status.repository')
  >('./sqlite.image-generation-status.repository');
  return {
    ...originalModule,
    SQLiteClient: vi.fn().mockImplementation(() => ({
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
      close: vi.fn(),
      serialize: vi.fn(),
    })),
  };
});

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

  beforeAll(() => {
    sqliteClient = new SQLiteClient();
    repository = new SqliteImageGenerationStatusRepository(sqliteClient);
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
});
