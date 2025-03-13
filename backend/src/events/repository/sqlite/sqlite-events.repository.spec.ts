import { SQLiteClient } from '@/config/sqlite-client';
import { SQLiteEventsRepository } from '@/events/repository/sqlite/sqlite-events.repository';
import { SfeirEvent } from '@/events/domain';
import { ConfigurationService } from '@/configuration/configuration.service';

const startDateTs = 1633046400000;
const endDateTs = 1633132800000;
const allowedPrompts = 3;
const mockEvent = SfeirEvent.from(
  '1',
  'Event 1',
  allowedPrompts,
  new Date(startDateTs),
  new Date(endDateTs)
);

describe('SqliteSfeirEventRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SQLiteEventsRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient({
      getSqliteDBPath: vi.fn().mockReturnValue(':memory:'),
    } as unknown as ConfigurationService);
    repository = new SQLiteEventsRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('getSfeirEvents', () => {
    it('should fetch all Sfeir events and map them correctly', async () => {
      vi.spyOn(sqliteClient, 'all').mockResolvedValue([
        {
          id: '1',
          name: 'Event 1',
          allowedPrompts,
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
      expect(savedEvent).toEqual({ ...event, allowedPrompts: 5 });
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
        allowedPrompts: 3,
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
