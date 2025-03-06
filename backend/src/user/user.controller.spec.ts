import { UserController } from './user.controller';
import { UserService } from '@/user/user.service';
import { describe, expect } from 'vitest';
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
    } as UserService;

    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Response;

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
});
