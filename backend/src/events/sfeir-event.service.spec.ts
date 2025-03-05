import { Test, TestingModule } from '@nestjs/testing';
import { SfeirEventService } from './sfeir-event.service';

import { vi } from 'vitest';
import {
  SFEIR_EVENT_REPOSITORY,
  SfeirEventRepository,
} from 'src/events/domain';

describe('SfeirEventService', () => {
  let service: SfeirEventService;
  let repositoryMock: SfeirEventRepository;

  beforeEach(async () => {
    repositoryMock = {
      getSfeirEvents: vi.fn(),
      getSfeirEvent: vi.fn(),
      saveSfeirEvent: vi.fn(),
      deleteSfeirEvent: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SfeirEventService,
        { provide: SFEIR_EVENT_REPOSITORY, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<SfeirEventService>(SfeirEventService);
  });

  it('should retrieve all events using getSfeirEvents', async () => {
    const mockEvents = [{ id: '1', name: 'Event A' }];
    repositoryMock.getSfeirEvents = vi.fn().mockResolvedValue(mockEvents);

    const result = await service.getSfeirEvents();

    expect(repositoryMock.getSfeirEvents).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockEvents);
  });

  it('should retrieve a specific event using getSfeirEvent', async () => {
    const mockEvent = { id: '1', name: 'Event A' };
    repositoryMock.getSfeirEvent = vi.fn().mockResolvedValue(mockEvent);

    const result = await service.getSfeirEvent('1');

    expect(repositoryMock.getSfeirEvent).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockEvent);
  });

  it('should create a new event using createSfeirEvent', async () => {
    const mockDto = {
      name: 'Event B',
      startDateTimestamp: '1622520000000',
      endDateTimestamp: '1622606400000',
    };
    const mockEvent = { id: '2', name: 'Event B' };
    repositoryMock.saveSfeirEvent = vi.fn().mockResolvedValue(mockEvent);

    const result = await service.createSfeirEvent(mockDto);

    expect(repositoryMock.saveSfeirEvent).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockEvent);
  });

  it('should delete an event using deleteSfeirEvent', async () => {
    repositoryMock.deleteSfeirEvent = vi.fn().mockResolvedValue(null);

    await service.deleteSfeirEvent('1');

    expect(repositoryMock.deleteSfeirEvent).toHaveBeenCalledWith('1');
    expect(repositoryMock.deleteSfeirEvent).toHaveBeenCalledTimes(1);
  });
});
