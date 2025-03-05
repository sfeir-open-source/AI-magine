import { vi } from 'vitest';
import { UserService } from '@/user/user.service';
import { User, UserRepository } from '@/user/domain';

const mockUser = User.from('1', 'hash', 'fp', true, 'nickname');
const mockUserRepository = {
  save: vi.fn().mockResolvedValue(mockUser),
  getUserIdByEmail: vi.fn().mockResolvedValue('123'),
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
      const result = await userService.create(mockUser);

      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserIdByEmail', () => {
    it('should return the user ID for a valid email', async () => {
      mockUserRepository.getUserIdByEmail.mockResolvedValue(mockUser.id);

      const result = await userService.getUserIdByEmail(mockUser.hashedEmail);

      expect(mockUserRepository.getUserIdByEmail).toHaveBeenCalledWith(
        mockUser.hashedEmail
      );
      expect(result).toBe(mockUser.id);
    });

    it('should return undefined if the user is not found', async () => {
      mockUserRepository.getUserIdByEmail.mockResolvedValue(undefined);

      const result = await userService.getUserIdByEmail(mockUser.hashedEmail);

      expect(mockUserRepository.getUserIdByEmail).toHaveBeenCalledWith(
        mockUser.hashedEmail
      );
      expect(result).toBeUndefined();
    });
  });
});
