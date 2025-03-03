import { expect, vi } from 'vitest';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqlitePromptRepository } from '@/prompt/sqlite.prompt.repository';
import { Prompt } from '@/prompt/prompt-types/prompt.domain';

describe('SqlitePromptRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqlitePromptRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient();
    repository = new SqlitePromptRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('countByEventIdAndUserId', () => {
    it('should return the count of prompts by event ID and user ID', async () => {
      const eventId = 'event123';
      const userId = 'user456';
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({ count: 3 });

      const result = await repository.countByEventIdAndUserId(eventId, userId);

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBe(3);
    });

    it('should return 0 if no prompts are found', async () => {
      const eventId = 'event789';
      const userId = 'user000';
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({ count: 0 });

      const result = await repository.countByEventIdAndUserId(eventId, userId);

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe('save', () => {
    it('should save a prompt and return it', async () => {
      const prompt = Prompt.create('event123', 'user456', 'Sample prompt text');
      vi.spyOn(sqliteClient, 'run').mockResolvedValue(null);

      const result = await repository.save(prompt);

      expect(sqliteClient.run).toHaveBeenCalled();
      expect(result).toEqual(prompt);
    });
  });
});
