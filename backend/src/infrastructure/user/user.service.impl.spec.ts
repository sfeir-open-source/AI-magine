import { UserServiceImpl } from '@/infrastructure/user/user.service.impl';
import { EncryptionService } from '@/infrastructure/shared/encryption/encryption.service';
import { ImageRepository } from '@/core/domain/image/image.repository';
import { User } from '@/core/domain/user/user';
import { Image } from '@/core/domain/image/image';
import { SfeirEventRepository } from '@/core/domain/sfeir-event/sfeir-event.repository';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';
import { UserRepository } from '@/core/domain/user/user.repository';
import { expect, Mock } from 'vitest';
import { NotFoundException } from '@nestjs/common';

const mockUser = User.from({
  id: '1',
  email: 'email',
  browserFingerprint: 'fp',
  allowContact: true,
  nickname: 'nickname',
});
const mockUserRepository = {
  save: vi.fn().mockResolvedValue(mockUser),
  getUserIdByEmail: vi.fn().mockResolvedValue('123'),
  getUserByEmail: vi.fn(),
  checkExistsById: vi.fn(),
  getUserByUserName: vi.fn(),
};

describe('UserService', () => {
  let userService: UserServiceImpl;
  let encryptionServiceMock: EncryptionService;
  let imagesRepositoryMock: ImageRepository;
  let eventRepositoryMock: SfeirEventRepository;

  beforeEach(() => {
    encryptionServiceMock = {
      encryptEmail: vi.fn().mockReturnValue('encrypted'),
      decryptEmail: vi.fn().mockReturnValue('decrypted'),
    } as unknown as EncryptionService;

    imagesRepositoryMock = {
      getImageByEventIdAndUserId: vi
        .fn()
        .mockResolvedValue([
          Image.from(
            'image-id',
            'https://example.org',
            'prompt-id',
            new Date(),
            false
          ),
        ]),
    } as unknown as ImageRepository;

    eventRepositoryMock = {
      getSfeirEvent: vi
        .fn()
        .mockResolvedValue(
          SfeirEvent.from(
            'event-id',
            'event-name',
            3,
            new Date(Date.now() - 10000),
            new Date(Date.now() + 10000)
          )
        ),
    } as unknown as SfeirEventRepository;

    userService = new UserServiceImpl(
      mockUserRepository as unknown as UserRepository,
      imagesRepositoryMock,
      eventRepositoryMock,
      encryptionServiceMock as unknown as EncryptionService
    );
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should save the user and return it', async () => {
      const result = await userService.create(mockUser);

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        email: 'encrypted',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserIdByEmail', () => {
    it('should return the user ID for a valid email', async () => {
      mockUserRepository.getUserIdByEmail.mockResolvedValue(mockUser.id);

      const result = await userService.getUserIdByEmail(mockUser.email);

      expect(mockUserRepository.getUserIdByEmail).toHaveBeenCalledWith(
        'encrypted'
      );
      expect(result).toBe(mockUser.id);
    });

    it('should return undefined if the user is not found', async () => {
      mockUserRepository.getUserIdByEmail.mockResolvedValue(undefined);

      const result = await userService.getUserIdByEmail(mockUser.email);

      expect(mockUserRepository.getUserIdByEmail).toHaveBeenCalledWith(
        'encrypted'
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return the user for a valid email', async () => {
      mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockUser.email);

      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        'encrypted'
      );
      expect(result).toBe(mockUser);
    });

    it('should return undefined if the user is not found', async () => {
      mockUserRepository.getUserByEmail.mockResolvedValue(undefined);

      const result = await userService.getUserByEmail(mockUser.email);

      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        'encrypted'
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return the result send by user repository', async () => {
      mockUserRepository.checkExistsById.mockResolvedValue(false);

      const result = await userService.checkIfExists(mockUser.id);

      expect(mockUserRepository.checkExistsById).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(result).toEqual(false);
    });
  });

  describe('getUserRemainingPromptsByEvent', () => {
    it('should return the number of remaining prompts', async () => {
      const result = await userService.getUserRemainingPromptsByEvent(
        'user-id',
        'event-id'
      );

      expect(eventRepositoryMock.getSfeirEvent).toHaveBeenCalledWith(
        'event-id'
      );
      expect(
        imagesRepositoryMock.getImageByEventIdAndUserId
      ).toHaveBeenCalledWith('event-id', 'user-id');
      expect(result).toEqual({
        allowed: 3,
        spent: 1,
        remaining: 2,
      });
    });
  });

  describe('getUserEmailByUserNameAndEvent', () => {
    const userName = 'testUser';
    const eventId = 'testEventId';
    const userEmail = 'test@example.com';

    it('should return the email of the user when both user and event exist', async () => {
      const mockEvent = { id: eventId };
      const mockUser = { userName, email: userEmail };

      (eventRepositoryMock.getSfeirEvent as Mock).mockResolvedValue(mockEvent);
      (mockUserRepository.getUserByUserName as Mock).mockResolvedValue(
        mockUser
      );

      const result = await userService.getUserEmailByUserNameAndEvent(
        userName,
        eventId
      );

      expect(result).toBe('decrypted');
      expect(eventRepositoryMock.getSfeirEvent).toHaveBeenCalledWith(eventId);
      expect(mockUserRepository.getUserByUserName).toHaveBeenCalledWith(
        userName
      );
      expect(encryptionServiceMock.decryptEmail).toHaveBeenCalledWith(
        userEmail
      );
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      (eventRepositoryMock.getSfeirEvent as Mock).mockResolvedValue(null);

      await expect(
        userService.getUserEmailByUserNameAndEvent(userName, eventId)
      ).rejects.toThrow(NotFoundException);

      expect(eventRepositoryMock.getSfeirEvent).toHaveBeenCalledWith(eventId);
      expect(mockUserRepository.getUserByUserName).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      const mockEvent = { id: eventId };

      (eventRepositoryMock.getSfeirEvent as Mock).mockResolvedValue(mockEvent);
      (mockUserRepository.getUserByUserName as Mock).mockResolvedValue(null);

      await expect(
        userService.getUserEmailByUserNameAndEvent(userName, eventId)
      ).rejects.toThrow(NotFoundException);

      expect(eventRepositoryMock.getSfeirEvent).toHaveBeenCalledWith(eventId);
      expect(mockUserRepository.getUserByUserName).toHaveBeenCalledWith(
        userName
      );
    });
  });
});
