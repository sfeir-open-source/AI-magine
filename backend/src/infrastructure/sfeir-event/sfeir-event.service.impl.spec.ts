import { SfeirEventServiceImpl } from './sfeir-event.service.impl';
import { SfeirEventRepository } from '@/core/domain/sfeir-event/sfeir-event.repository';
import { UserRepository } from '@/core/domain/user/user.repository';
import { ImageRepository } from '@/core/domain/image/image.repository';
import { ImageGenerationStatusRepository } from '@/core/domain/image-generation/image-generation-status.repository';
import { NotFoundException } from '@nestjs/common';
import { EncryptionService } from '@/infrastructure/shared/encryption/encryption.service';

describe('SfeirEventService', () => {
  let service: SfeirEventServiceImpl;
  let repositoryMock: SfeirEventRepository;
  let userRepositoryMock: UserRepository;
  let imageRepositoryMock: ImageRepository;
  let imageGenerationStatusRepository: ImageGenerationStatusRepository;
  let encryptionServiceMock: EncryptionService;

  beforeEach(async () => {
    repositoryMock = {
      getSfeirEvents: vi.fn(),
      getSfeirEvent: vi.fn(),
      saveSfeirEvent: vi.fn(),
      deleteSfeirEvent: vi.fn(),
    };

    userRepositoryMock = {
      countUsersByEvent: vi.fn(),
      getUsersByEvent: vi.fn(),
    } as unknown as UserRepository;

    imageRepositoryMock = {
      countImagesByEvent: vi.fn(),
    } as unknown as ImageRepository;

    imageGenerationStatusRepository = {
      countStatusByEvent: vi.fn(),
    } as unknown as ImageGenerationStatusRepository;

    encryptionServiceMock = {
      encryptEmail: vi.fn().mockReturnValue('encrypted'),
      decryptEmail: vi.fn().mockReturnValue('decrypted'),
    } as unknown as EncryptionService;

    service = new SfeirEventServiceImpl(
      repositoryMock,
      userRepositoryMock,
      imageRepositoryMock,
      imageGenerationStatusRepository,
      encryptionServiceMock
    );
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

  it('should get the event images count', async () => {
    imageRepositoryMock.countImagesByEvent = vi.fn().mockResolvedValue(10);

    const count = await service.countEventImages('event-id');

    expect(count).toEqual(10);
    expect(imageRepositoryMock.countImagesByEvent).toHaveBeenCalledWith(
      'event-id'
    );
    expect(imageRepositoryMock.countImagesByEvent).toHaveBeenCalledTimes(1);
  });

  it('should get the generation statuses count', async () => {
    imageGenerationStatusRepository.countStatusByEvent = vi
      .fn()
      .mockResolvedValue(10);

    const count = await service.countStatusByEvent('event-id', 'status');

    expect(count).toEqual(10);
    expect(
      imageGenerationStatusRepository.countStatusByEvent
    ).toHaveBeenCalledWith('event-id', 'status');
    expect(
      imageGenerationStatusRepository.countStatusByEvent
    ).toHaveBeenCalledTimes(1);
  });

  it('should retrieve the users for a specific event using getEventUsers', async () => {
    const mockEvent = { id: '1', name: 'Event A' };
    const mockUsers = [
      { id: 'user1', name: 'User A', email: 'decrypted' },
      { id: 'user2', name: 'User B', email: 'decrypted' },
    ];

    repositoryMock.getSfeirEvent = vi.fn().mockResolvedValue(mockEvent);
    userRepositoryMock.getUsersByEvent = vi.fn().mockResolvedValue(mockUsers);

    const result = await service.getEventUsers('1');

    expect(repositoryMock.getSfeirEvent).toHaveBeenCalledWith('1');
    expect(userRepositoryMock.getUsersByEvent).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUsers);
  });

  it('should throw NotFoundException if event is not found when retrieving users', async () => {
    repositoryMock.getSfeirEvent = vi.fn().mockResolvedValue(undefined);

    await expect(
      service.getEventUsers('non-existing-event-id')
    ).rejects.toThrowError(
      new NotFoundException('Event non-existing-event-id not found')
    );

    expect(repositoryMock.getSfeirEvent).toHaveBeenCalledWith(
      'non-existing-event-id'
    );
    expect(userRepositoryMock.getUsersByEvent).not.toHaveBeenCalled();
  });
});
