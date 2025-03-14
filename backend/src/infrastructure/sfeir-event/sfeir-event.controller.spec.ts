import { NotFoundException } from '@nestjs/common';
import { SfeirEventController } from '@/infrastructure/sfeir-event/sfeir-event.controller';
import { CreateSfeirEventDto } from '@/core/application/sfeir-event/dto/create-sfeir-event.dto';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';
import { SfeirEventService } from '@/core/application/sfeir-event/sfeir-event.service';

describe('SfeirEventController', () => {
  let sfeirEventController: SfeirEventController;
  let sfeirEventService: SfeirEventService;

  beforeEach(() => {
    sfeirEventService = {
      getSfeirEvents: vi.fn(),
      getSfeirEvent: vi.fn(),
      createSfeirEvent: vi.fn(),
      deleteSfeirEvent: vi.fn(),
      countEventUsers: vi.fn(),
      countEventImages: vi.fn(),
    } as unknown as SfeirEventService;

    sfeirEventController = new SfeirEventController(sfeirEventService);
  });

  describe('getSfeirEvents', () => {
    it('should return a list of events', async () => {
      const startDate = new Date(2023, 1, 1);
      const endDate = new Date(2023, 1, 2);
      const allowedPrompts = 5;
      const mockEvents = [
        SfeirEvent.from('1', 'Event 1', allowedPrompts, startDate, endDate),
      ];
      vi.spyOn(sfeirEventService, 'getSfeirEvents').mockResolvedValue(
        mockEvents
      );

      const result = await sfeirEventController.getSfeirEvents();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Event 1',
          allowedPrompts,
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
      const allowedPrompts = 5;
      const mockEvent = SfeirEvent.from(
        '1',
        'Event 1',
        allowedPrompts,
        startDate,
        endDate
      );
      vi.spyOn(sfeirEventService, 'getSfeirEvent').mockResolvedValue(mockEvent);

      const result = await sfeirEventController.getSfeirEvent('1');
      expect(result).toEqual({
        id: '1',
        name: 'Event 1',
        allowedPrompts,
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
        5,
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
        allowedPrompts: 5,
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

  describe('countEventUsers', () => {
    it('should return 404 if event does not exist', async () => {
      vi.mocked(sfeirEventService.countEventUsers).mockRejectedValue(
        new NotFoundException()
      );

      await expect(
        sfeirEventController.countEventUsers('invalid-id')
      ).rejects.toThrow(NotFoundException);
    });

    it('should return 200 and the number of users', async () => {
      vi.mocked(sfeirEventService.countEventUsers).mockResolvedValue(3);

      await expect(
        sfeirEventController.countEventUsers('valid-id')
      ).resolves.toEqual(3);
    });
  });

  describe('countEventImages', () => {
    it('should return 404 if event does not exist', async () => {
      vi.mocked(sfeirEventService.countEventImages).mockRejectedValue(
        new NotFoundException()
      );

      await expect(
        sfeirEventController.countEventImages('invalid-id')
      ).rejects.toThrow(NotFoundException);
    });

    it('should return 200 and the number of iamges', async () => {
      vi.mocked(sfeirEventService.countEventImages).mockResolvedValue(3);

      await expect(
        sfeirEventController.countEventImages('valid-id')
      ).resolves.toEqual(3);
    });
  });
});
