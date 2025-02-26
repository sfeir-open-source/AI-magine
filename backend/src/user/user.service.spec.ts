import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserService } from '@/user/user.service';
import { User, UserRepository } from '@/user/user-types';

const mockUserRepository = {
  save: vi.fn(),
  getUserIdByEmail: vi.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(
      mockUserRepository as unknown as UserRepository
    );
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should save the user and return it', async () => {
      const user = User.from('1', 'hash', 'fp', true);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await userService.create(user);

      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('getUserIdByEmail', () => {
    it('should return the user ID for a valid email', async () => {
      const email = 'test@example.com';
      const userId = '123';
      mockUserRepository.getUserIdByEmail.mockResolvedValue(userId);

      const result = await userService.getUserIdByEmail(email);

      expect(mockUserRepository.getUserIdByEmail).toHaveBeenCalledWith(email);
      expect(result).toBe(userId);
    });

    it('should return undefined if the user is not found', async () => {
      const email = 'unknown@example.com';
      mockUserRepository.getUserIdByEmail.mockResolvedValue(undefined);

      const result = await userService.getUserIdByEmail(email);

      expect(mockUserRepository.getUserIdByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeUndefined();
    });
  });
});
