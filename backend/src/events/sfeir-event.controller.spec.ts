import { vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { SfeirEventController } from '@/events/sfeir-event.controller';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { CreateSfeirEventDto, SfeirEvent } from 'src/events/domain';

describe('SfeirEventController', () => {
  let sfeirEventController: SfeirEventController;
  let sfeirEventService: SfeirEventService;

  beforeEach(() => {
    sfeirEventService = {
      getSfeirEvents: vi.fn(),
      getSfeirEvent: vi.fn(),
      createSfeirEvent: vi.fn(),
      deleteSfeirEvent: vi.fn(),
    } as unknown as SfeirEventService;

    sfeirEventController = new SfeirEventController(sfeirEventService);
  });

  describe('getSfeirEvents', () => {
    it('should return a list of events', async () => {
      const startDate = new Date(2023, 1, 1);
      const endDate = new Date(2023, 1, 2);
      const mockEvents = [SfeirEvent.from('1', 'Event 1', startDate, endDate)];
      vi.spyOn(sfeirEventService, 'getSfeirEvents').mockResolvedValue(
        mockEvents
      );

      const result = await sfeirEventController.getSfeirEvents();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Event 1',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isActive: false,
        },
      ]);
    });
  });

  describe('getSfeirEvent', () => {
    it('should return an event by id', async () => {
      const startDate = new Date(2023, 1, 1);
      const endDate = new Date(2023, 1, 2);
      const mockEvent = SfeirEvent.from('1', 'Event 1', startDate, endDate);
      vi.spyOn(sfeirEventService, 'getSfeirEvent').mockResolvedValue(mockEvent);

      const result = await sfeirEventController.getSfeirEvent('1');
      expect(result).toEqual({
        id: '1',
        name: 'Event 1',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: false,
      });
    });

    it('should throw an error if event is not found', async () => {
      vi.spyOn(sfeirEventService, 'getSfeirEvent').mockResolvedValue(undefined);

      await expect(
        sfeirEventController.getSfeirEvent('invalid-id')
      ).rejects.toThrow(
        new NotFoundException('Event with id invalid-id doest not exists.')
      );
    });
  });

  describe('createSfeirEvent', () => {
    it('should create a new event', async () => {
      const createDto: CreateSfeirEventDto = {
        name: 'New Event',
        startDateTimestamp: new Date(2023, 1, 1, 0, 0, 0).getTime().toString(),
        endDateTimestamp: new Date(2023, 1, 2, 0, 0, 0).getTime().toString(),
      };
      const mockEvent = SfeirEvent.from(
        '1',
        'New Event',
        new Date(2023, 1, 1),
        new Date(2023, 1, 2)
      );
      vi.spyOn(sfeirEventService, 'createSfeirEvent').mockResolvedValue(
        mockEvent
      );

      const result = await sfeirEventController.createSfeirEvent(createDto);
      expect(result).toEqual({
        id: '1',
        name: 'New Event',
        startDate: new Date(2023, 1, 1, 0, 0, 0).toISOString(),
        endDate: new Date(2023, 1, 2, 0, 0, 0).toISOString(),
        isActive: false,
      });
    });
  });

  describe('deleteSfeirEvent', () => {
    it('should delete an event by id', async () => {
      vi.spyOn(sfeirEventService, 'deleteSfeirEvent').mockResolvedValue(
        undefined
      );

      const result = await sfeirEventController.deleteSfeirEvent('1');
      expect(result).toBeUndefined();
      expect(sfeirEventService.deleteSfeirEvent).toHaveBeenCalledWith('1');
    });
  });
});
