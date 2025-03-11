import { UserService } from '@/user/user.service';
import { User, UserRepository } from '@/user/domain';
import { EncryptionService } from '@/user/encryption/encryption.service';

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
};

describe('UserService', () => {
  let userService: UserService;
  let encryptionServiceMock: EncryptionService;

  beforeEach(() => {
    encryptionServiceMock = {
      encryptEmail: vi.fn().mockReturnValue('encrypted'),
    };

    userService = new UserService(
      mockUserRepository as unknown as UserRepository,
      encryptionServiceMock
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
      expect(result).toBe(false);
    });
  });
});
