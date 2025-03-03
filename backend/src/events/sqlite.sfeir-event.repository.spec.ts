import { expect, vi } from 'vitest';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteSfeirEventRepository } from '@/events/sqlite.sfeir-event.repository';
import { SfeirEvent } from '@/events/events-types';

const startDateTs = 1633046400000;
const endDateTs = 1633132800000;
const mockEvent = SfeirEvent.from(
  '1',
  'Event 1',
  new Date(startDateTs),
  new Date(endDateTs)
);

describe('SqliteSfeirEventRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqliteSfeirEventRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient();
    repository = new SqliteSfeirEventRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('getSfeirEvents', () => {
    it('should fetch all Sfeir events and map them correctly', async () => {
      vi.spyOn(sqliteClient, 'all').mockResolvedValue([
        {
          id: '1',
          name: 'Event 1',
          startDateTs,
          endDateTs,
        },
      ]);

      const result = await repository.getSfeirEvents();

      expect(sqliteClient.all).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(mockEvent);
    });
  });

  describe('saveSfeirEvent', () => {
    it('should save a Sfeir event to the database', async () => {
      const event = SfeirEvent.create(
        'Test Event',
        new Date(startDateTs),
        new Date(endDateTs)
      );
      vi.spyOn(sqliteClient, 'run');

      const savedEvent = await repository.saveSfeirEvent(event);

      expect(sqliteClient.run).toHaveBeenCalled();
      expect(savedEvent).toBe(event);
    });
  });

  describe('deleteSfeirEvent', () => {
    it('should delete a Sfeir event from the database by ID', async () => {
      const id = '1';
      vi.spyOn(sqliteClient, 'run');

      await repository.deleteSfeirEvent(id);

      expect(sqliteClient.run).toHaveBeenCalled();
    });
  });

  describe('getSfeirEvent', () => {
    it('should fetch a Sfeir event by ID and map it correctly', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        id: '1',
        name: 'Event 1',
        startDateTs,
        endDateTs,
      });

      const result = await repository.getSfeirEvent('1');

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toMatchObject(mockEvent);
    });

    it('should return undefined if the Sfeir event does not exist', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const result = await repository.getSfeirEvent('non-existent-id');

      expect(sqliteClient.get).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
