import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnprocessableEntityException } from '@nestjs/common';
import { SfeirEventController } from '@/events/sfeir-event.controller';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { CreateSfeirEventDto, SfeirEventBuilder } from '@/events/events-types';

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
      const mockEvents = [
        SfeirEventBuilder.create()
          .withId('1')
          .withName('Event 1')
          .withStartDate(new Date(2023, 1, 1))
          .withEndDate(new Date(2023, 1, 2))
          .build(),
      ];
      vi.spyOn(sfeirEventService, 'getSfeirEvents').mockResolvedValue(
        mockEvents
      );

      const result = await sfeirEventController.getSfeirEvents();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Event 1',
          startDate: '2023-01-31T23:00:00.000Z',
          endDate: '2023-02-01T23:00:00.000Z',
          isActive: false,
        },
      ]);
    });
  });

  describe('getSfeirEvent', () => {
    it('should return an event by id', async () => {
      const mockEvent = SfeirEventBuilder.create()
        .withId('1')
        .withName('Event 1')
        .withStartDate(new Date(2023, 1, 1))
        .withEndDate(new Date(2023, 1, 2))
        .build();
      vi.spyOn(sfeirEventService, 'getSfeirEvent').mockResolvedValue(mockEvent);

      const result = await sfeirEventController.getSfeirEvent('1');
      expect(result).toEqual({
        id: '1',
        name: 'Event 1',
        startDate: '2023-01-31T23:00:00.000Z',
        endDate: '2023-02-01T23:00:00.000Z',
        isActive: false,
      });
    });

    it('should throw an error if event is not found', async () => {
      vi.spyOn(sfeirEventService, 'getSfeirEvent').mockResolvedValue(undefined);

      await expect(
        sfeirEventController.getSfeirEvent('invalid-id')
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'Event with id invalid-id doest not exists.'
        )
      );
    });
  });

  describe('createSfeirEvent', () => {
    it('should create a new event', async () => {
      const createDto: CreateSfeirEventDto = {
        name: 'New Event',
        startDateTs: new Date(2023, 1, 1, 0, 0, 0).getTime().toString(),
        endDateTs: new Date(2023, 1, 2, 0, 0, 0).getTime().toString(),
      };
      const mockEvent = SfeirEventBuilder.create()
        .withId('1')
        .withName('New Event')
        .withStartDate(new Date(2023, 1, 1, 0, 0, 0))
        .withEndDate(new Date(2023, 1, 2, 0, 0, 0))
        .build();
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
