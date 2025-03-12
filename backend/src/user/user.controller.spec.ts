import { UserController } from './user.controller';
import { UserService } from '@/user/user.service';
import { Response } from 'express';
import { User } from '@/user/domain';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let response: Response;

  beforeEach(() => {
    userService = {
      getUserByEmail: vi.fn(),
      create: vi.fn(),
      getUserRemainingPromptsByEvent: vi.fn(),
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
  });
});
