import { UserController } from './user.controller';
import { Response } from 'express';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { UserService } from '@/core/application/user/user.service';
import { User } from '@/core/domain/user/user';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let response: Response;

  beforeEach(() => {
    userService = {
      getUserByEmail: vi.fn(),
      create: vi.fn(),
      getUserRemainingPromptsByEvent: vi.fn(),
      getUserEmailByUserNameAndEvent: vi.fn(),
    } as unknown as UserService;

    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    controller = new UserController(userService);
  });

  describe('createUser', () => {
    it('creates a new user if it does not exist', async () => {
      const mockUserDto = {
        userEmail: 'test@test.com',
        userNickname: 'nickname',
        browserFingerprint: 'fingerprint',
        allowContact: false,
      };

      const mockCreatedUser = User.from({
        id: '1',
        email: mockUserDto.userEmail,
        browserFingerprint: mockUserDto.browserFingerprint,
        allowContact: mockUserDto.allowContact,
        nickname: mockUserDto.userNickname,
      });

      vi.mocked(userService.getUserByEmail).mockResolvedValue(undefined);
      vi.mocked(userService.create).mockResolvedValue(mockCreatedUser);

      await controller.createUser(mockUserDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith(mockCreatedUser);
    });

    it('returns an existing user if it exists', async () => {
      const mockUserDto = {
        userEmail: 'test@test.com',
        userNickname: 'nickname',
        browserFingerprint: 'fingerprint',
        allowContact: false,
      };

      const mockExistingUser = User.from({
        id: '1',
        email: mockUserDto.userEmail,
        browserFingerprint: mockUserDto.browserFingerprint,
        allowContact: mockUserDto.allowContact,
        nickname: mockUserDto.userNickname,
      });

      vi.mocked(userService.getUserByEmail).mockResolvedValue(mockExistingUser);

      await controller.createUser(mockUserDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockExistingUser);
    });
  });

  describe('remainingPrompts', () => {
    it('should return the remaining prompts', async () => {
      vi.mocked(userService.getUserRemainingPromptsByEvent).mockResolvedValue({
        allowed: 3,
        spent: 2,
        remaining: 1,
      });

      const remainingPrompt = await controller.getRemainingPrompts(
        'event-id',
        'user-id'
      );

      expect(userService.getUserRemainingPromptsByEvent).toHaveBeenCalledWith(
        'event-id',
        'user-id'
      );
      expect(remainingPrompt).toEqual({
        allowed: 3,
        spent: 2,
        remaining: 1,
      });
    });

    describe('getUserEmailByUsername', () => {
      it('should return the email of the user given username and event ID', async () => {
        const userName = 'testUser';
        const eventId = 'event123';
        const mockEmail = 'test@example.com';

        vi.mocked(userService.getUserEmailByUserNameAndEvent).mockResolvedValue(
          mockEmail
        );

        const result = await controller.getUserEmailByUsername(
          userName,
          eventId
        );

        expect(userService.getUserEmailByUserNameAndEvent).toHaveBeenCalledWith(
          userName,
          eventId
        );
        expect(result).toBe(mockEmail);
      });

      it('should handle an error thrown by the service', async () => {
        const userName = 'testUser';
        const eventId = 'event123';

        vi.mocked(userService.getUserEmailByUserNameAndEvent).mockRejectedValue(
          new NotFoundException('User not found')
        );

        await expect(
          controller.getUserEmailByUsername(userName, eventId)
        ).rejects.toThrow(new NotFoundException('User not found'));
        expect(userService.getUserEmailByUserNameAndEvent).toHaveBeenCalledWith(
          userName,
          eventId
        );

        vi.mocked(userService.getUserEmailByUserNameAndEvent).mockRejectedValue(
          new NotFoundException('Event not found')
        );

        await expect(
          controller.getUserEmailByUsername(userName, eventId)
        ).rejects.toThrow(new NotFoundException('Event not found'));
        expect(userService.getUserEmailByUserNameAndEvent).toHaveBeenCalledWith(
          userName,
          eventId
        );
      });
    });
  });
});
