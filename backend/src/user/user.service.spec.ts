import { UserService } from '@/user/user.service';
import { User, UserRepository } from '@/user/domain';
import { EncryptionService } from '@/user/encryption/encryption.service';
import { Image } from '@/images/domain';
import { SfeirEvent, SfeirEventRepository } from '@/events/domain';
import { ImagesRepository } from '@/images/domain/images.repository';

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
  let imagesRepositoryMock: ImagesRepository;
  let eventRepositoryMock: SfeirEventRepository;

  beforeEach(() => {
    encryptionServiceMock = {
      encryptEmail: vi.fn().mockReturnValue('encrypted'),
    };

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
    } as unknown as ImagesRepository;

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

    userService = new UserService(
      mockUserRepository as unknown as UserRepository,
      encryptionServiceMock as unknown as EncryptionService,
      imagesRepositoryMock,
      eventRepositoryMock
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
        'event-id',
        'user-id'
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
});
