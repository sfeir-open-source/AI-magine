import { Test, TestingModule } from '@nestjs/testing';
import { SfeirEventServiceImpl } from './sfeir-event.service.impl';
import {
  SFEIR_EVENT_REPOSITORY,
  SfeirEventRepository,
} from '@/core/domain/sfeir-event/sfeir-event.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@/core/domain/user/user.repository';

describe('SfeirEventService', () => {
  let service: SfeirEventServiceImpl;
  let repositoryMock: SfeirEventRepository;
  let userRepositoryMock: UserRepository;

  beforeEach(async () => {
    repositoryMock = {
      getSfeirEvents: vi.fn(),
      getSfeirEvent: vi.fn(),
      saveSfeirEvent: vi.fn(),
      deleteSfeirEvent: vi.fn(),
    };

    userRepositoryMock = {
      countUsersByEvent: vi.fn(),
    } as unknown as UserRepository;

    // TODO: remove testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SfeirEventServiceImpl,
        { provide: SFEIR_EVENT_REPOSITORY, useValue: repositoryMock },
        { provide: USER_REPOSITORY, useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<SfeirEventServiceImpl>(SfeirEventServiceImpl);
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

  it('should get the event users count', async () => {
    userRepositoryMock.countUsersByEvent = vi.fn().mockResolvedValue(10);

    const count = await service.countEventUsers('event-id');

    expect(count).toEqual(10);
    expect(userRepositoryMock.countUsersByEvent).toHaveBeenCalledWith(
      'event-id'
    );
    expect(userRepositoryMock.countUsersByEvent).toHaveBeenCalledTimes(1);
  });
});
